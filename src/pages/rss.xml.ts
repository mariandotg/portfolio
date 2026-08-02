import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("notes", ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — Notes`,
    description: SITE.description,
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/notes/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
