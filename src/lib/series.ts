import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/utils";
import { localizedSeries, getLocalizedPath } from "../i18n/utils";
import { seriesBannerBase } from "./effects/banner/assets";
import type { Translations } from "../i18n/en";

export interface SeriesCardData {
  slug: string;
  path: string;
  featured: boolean;
  title: string;
  description: string;
  count: number;
  status: "ongoing" | "complete";
  comingSoon: boolean;
  bannerBase: string;
  meta: string;
}

// Top-level routes a rootLevel series would collide with. A rootLevel series
// lives at `/<id>`, sharing the namespace with these static pages.
const RESERVED_ROOT_SLUGS = new Set([
  "about", "about-me", "contact", "notes", "blog", "work", "dev", "api", "rss.xml", "404", "index", "es",
  "cv", "landing",
]);

export function seriesPath(id: string, rootLevel: boolean): string {
  return rootLevel ? `/${id}` : `/notes/series/${id}`;
}

export async function getRootLevelSeries(): Promise<CollectionEntry<"series">[]> {
  const entries = await getCollection("series", ({ data }) => data.rootLevel);
  for (const entry of entries) {
    if (RESERVED_ROOT_SLUGS.has(entry.id)) {
      throw new Error(
        `Series "${entry.id}" has rootLevel: true but its slug collides with the reserved top-level route "/${entry.id}". Rename the series file or unset rootLevel.`,
      );
    }
  }
  return entries;
}

export function getStandardSeries(): Promise<CollectionEntry<"series">[]> {
  return getCollection("series", ({ data }) => !data.rootLevel);
}

function statusLabel(status: "ongoing" | "complete", t: Translations): string {
  return status === "complete" ? t.notes.series.complete : t.notes.series.inProgress;
}

function metaLabel(count: number, status: "ongoing" | "complete", t: Translations): string {
  if (count === 0) return t.notes.series.comingSoon;
  const unit = count === 1 ? t.notes.series.partsCountOne : t.notes.series.partsCount;
  return `${statusLabel(status, t)} · ${count} ${unit}`;
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
    getCollection("notes", ({ data }) => !data.draft),
  ]);

  return seriesEntries
    .sort((a, b) => a.data.order - b.data.order)
    .map((s) => {
      const count = postsInSeries(posts, s.id).length;
      const { title, description } = localizedSeries(s.data, lang);
      return {
        slug: s.id,
        path: seriesPath(s.id, s.data.rootLevel),
        featured: s.data.rootLevel,
        title,
        description,
        count,
        status: s.data.status,
        comingSoon: count === 0,
        bannerBase: seriesBannerBase(s.id, s.data.bannerImage),
        meta: metaLabel(count, s.data.status, t),
      };
    });
}

export async function getSeriesPosts(slug: string): Promise<CollectionEntry<"notes">[]> {
  const posts = await getCollection("notes", ({ data }) => !data.draft);
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
  const posts = await getSeriesPosts(slug);
  return Promise.all(
    posts.map(async (post, idx) => {
      const { remarkPluginFrontmatter } = await render(post);
      return {
        order: idx + 1,
        href: getLocalizedPath(`/notes/${post.id}`, lang),
        title: post.data.title,
        description: post.data.description,
        readingTime: remarkPluginFrontmatter?.readingTime as number | undefined,
        status: (idx === 0 ? "current" : "available") as RoadmapStatus,
      };
    }),
  );
}

export { metaLabel };
