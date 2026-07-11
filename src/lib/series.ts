import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/utils";
import { localizedSeries } from "../i18n/utils";
import type { Translations } from "../i18n/en";

export interface SeriesCardData {
  slug: string;
  title: string;
  description: string;
  count: number;
  status: "ongoing" | "complete";
  comingSoon: boolean;
  bannerSeed?: string;
  meta: string;
}

function statusLabel(status: "ongoing" | "complete", t: Translations): string {
  return status === "complete" ? t.blog.series.complete : t.blog.series.inProgress;
}

function metaLabel(count: number, status: "ongoing" | "complete", t: Translations): string {
  if (count === 0) return t.blog.series.comingSoon;
  const unit = count === 1 ? t.blog.series.partsCountOne : t.blog.series.partsCount;
  return `${statusLabel(status, t)} · ${count} ${unit}`;
}

function postsInSeries(
  posts: CollectionEntry<"blog">[],
  slug: string,
): CollectionEntry<"blog">[] {
  return posts
    .filter((p) => p.data.series === slug)
    .sort((a, b) => (a.data.seriesOrder ?? 99) - (b.data.seriesOrder ?? 99));
}

export async function getSeriesIndex(lang: Lang, t: Translations): Promise<SeriesCardData[]> {
  const [seriesEntries, posts] = await Promise.all([
    getCollection("series"),
    getCollection("blog", ({ data }) => !data.draft),
  ]);

  return seriesEntries
    .sort((a, b) => a.data.order - b.data.order)
    .map((s) => {
      const count = postsInSeries(posts, s.id).length;
      const { title, description } = localizedSeries(s.data, lang);
      return {
        slug: s.id,
        title,
        description,
        count,
        status: s.data.status,
        comingSoon: count === 0,
        bannerSeed: s.data.bannerSeed,
        meta: metaLabel(count, s.data.status, t),
      };
    });
}

export async function getSeriesPosts(slug: string): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return postsInSeries(posts, slug);
}

export { metaLabel };
