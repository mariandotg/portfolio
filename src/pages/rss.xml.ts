import rss from "@astrojs/rss";
import { SITE } from "../config";
import type { APIContext } from "astro";
import { getPublishedNotes, noteSlug } from "../lib/notes";

export async function GET(context: APIContext) {
  const posts = await getPublishedNotes("en");
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — Notes`,
    description: SITE.description,
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/notes/${noteSlug(post)}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
