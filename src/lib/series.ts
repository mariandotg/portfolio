import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/utils";
import { localizedSeries, getLocalizedPath } from "../i18n/utils";
import { seriesBannerBase } from "./effects/banner/assets";
import type { Translations } from "../i18n/en";
import { assertTranslationIntegrity, getPublishedNotes, noteSlug } from "./notes";

export interface SeriesCardData {
  slug: string;
  path: string;
  title: string;
  description: string;
  count: number;
  status: "ongoing" | "complete";
  bannerBase: string;
  meta: string;
}

// Top-level routes a rootLevel series would collide with. A rootLevel series
// lives at `/<id>`, sharing the namespace with these static pages.
const RESERVED_ROOT_SLUGS = new Set([
  "about", "about-me", "contact", "notes", "blog", "work", "dev", "api", "rss.xml", "404", "index", "es",
  "cv", "landing", "resume",
]);

export function seriesPath(id: string, rootLevel: boolean): string {
  return rootLevel ? `/${id}` : `/notes/series/${id}`;
}

// A series with no published post is unpublished: no listing, no route. docs/design/design-system.md §7.
async function publishedSeriesIds(lang: Lang): Promise<Set<string>> {
  const posts = await getPublishedNotes(lang);
  return new Set(posts.flatMap((p) => (p.data.series ? [p.data.series] : [])));
}

export async function getRootLevelSeries(lang: Lang): Promise<CollectionEntry<"series">[]> {
  const entries = await getCollection("series", ({ data }) => data.rootLevel);
  // The collision guard covers unpublished series too, so a slug clash fails before the first post ships.
  for (const entry of entries) {
    if (RESERVED_ROOT_SLUGS.has(entry.id)) {
      throw new Error(
        `Series "${entry.id}" has rootLevel: true but its slug collides with the reserved top-level route "/${entry.id}". Rename the series file or unset rootLevel.`,
      );
    }
  }
  const published = await publishedSeriesIds(lang);
  return entries.filter((entry) => published.has(entry.id));
}

export async function getStandardSeries(lang: Lang): Promise<CollectionEntry<"series">[]> {
  const published = await publishedSeriesIds(lang);
  return getCollection("series", ({ data, id }) => !data.rootLevel && published.has(id));
}

function statusLabel(status: "ongoing" | "complete", t: Translations): string {
  return status === "complete" ? t.notes.series.complete : t.notes.series.inProgress;
}

function metaLabel(count: number, status: "ongoing" | "complete", t: Translations): string {
  const unit = count === 1 ? t.notes.series.partsCountOne : t.notes.series.partsCount;
  return `${statusLabel(status, t)} · ${count} ${unit}`;
}

export function seriesLandingMeta(
  count: number,
  status: "ongoing" | "complete",
  totalReadingMinutes: number,
  t: Translations,
): string {
  const unit = count === 1 ? t.notes.series.partsCountOne : t.notes.series.partsCount;
  const time = `${totalReadingMinutes} ${t.notes.readingTime}`;
  return `${statusLabel(status, t)} · ${count} ${unit} · ${time}`;
}

export function totalReadingMinutes(items: RoadmapItem[]): number {
  return items.reduce((sum, item) => sum + (item.readingTime ?? 0), 0);
}

let seriesIntegrityChecked = false;

export async function assertSeriesIntegrity(): Promise<void> {
  // Memoize only in a build: the dev server lives across content edits.
  if (seriesIntegrityChecked && !import.meta.env.DEV) return;

  const [seriesEntries, posts] = await Promise.all([
    getCollection("series"),
    getCollection("notes", ({ data }) => !data.draft),
  ]);
  const seriesIds = new Set(seriesEntries.map((s) => s.id));
  await assertTranslationIntegrity();

  for (const post of posts) {
    const seriesId = post.data.series;
    if (!seriesId) continue;
    if (!seriesIds.has(seriesId)) {
      throw new Error(
        `Note "${post.id}" references series "${seriesId}" which does not exist. Add a series JSON file or remove the series field from the post.`,
      );
    }
  }

  for (const series of seriesEntries) {
    const inSeries = posts.filter((p) => p.data.series === series.id);
    const byOrder = new Map<string, string[]>();
    for (const post of inSeries) {
      const order = post.data.seriesOrder;
      if (order === undefined) continue;
      const key = `${post.data.lang}:${order}`;
      const ids = byOrder.get(key) ?? [];
      ids.push(post.id);
      byOrder.set(key, ids);
    }
    for (const [key, ids] of byOrder) {
      if (ids.length > 1) {
        throw new Error(
          `Series "${series.id}" has duplicate language and seriesOrder ${key} on posts "${ids[0]}" and "${ids[1]}".`,
        );
      }
    }
  }
  seriesIntegrityChecked = true;
}

function postsInSeries(
  posts: CollectionEntry<"notes">[],
  slug: string,
): CollectionEntry<"notes">[] {
  return posts
    .filter((p) => p.data.series === slug)
    .sort((a, b) => (a.data.seriesOrder ?? 99) - (b.data.seriesOrder ?? 99));
}

export async function getSeriesIndex(lang: Lang, t: Translations): Promise<SeriesCardData[]> {
  const [seriesEntries, posts] = await Promise.all([
    getCollection("series"),
    getPublishedNotes(lang),
  ]);

  return seriesEntries
    .map((s) => ({ s, count: postsInSeries(posts, s.id).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => a.s.data.order - b.s.data.order)
    .map(({ s, count }) => {
      const { title, description } = localizedSeries(s.data, lang);
      return {
        slug: s.id,
        path: seriesPath(s.id, s.data.rootLevel),
        title,
        description,
        count,
        status: s.data.status,
        bannerBase: seriesBannerBase(s.id, s.data.bannerImage),
        meta: metaLabel(count, s.data.status, t),
      };
    });
}

export async function getSeriesPosts(slug: string, lang: Lang): Promise<CollectionEntry<"notes">[]> {
  const posts = await getPublishedNotes(lang);
  return postsInSeries(posts, slug);
}

export type RoadmapStatus = "read" | "current" | "available" | "upcoming";

export interface RoadmapItem {
  order: number;
  href?: string;
  title: string;
  description: string;
  readingTime?: number;
  status: RoadmapStatus;
}

// Reading state is not persisted yet, so every published part is offered as
// readable and the first one is highlighted as the entry point. Once progress
// is tracked, only the `status` derivation below needs to change.
export async function getSeriesRoadmap(slug: string, lang: Lang): Promise<RoadmapItem[]> {
  const posts = await getSeriesPosts(slug, lang);
  return Promise.all(
    posts.map(async (post, idx) => {
      const { remarkPluginFrontmatter } = await render(post);
      return {
        order: idx + 1,
        href: getLocalizedPath(`/notes/${noteSlug(post)}`, lang),
        title: post.data.title,
        description: post.data.description,
        readingTime: remarkPluginFrontmatter?.readingTime as number | undefined,
        status: (idx === 0 ? "current" : "available") as RoadmapStatus,
      };
    }),
  );
}

export { metaLabel };
