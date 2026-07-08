export const prerender = false;

import type { APIRoute } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";

// Dev-only endpoint: persists the chosen banner seed into a blog post's
// frontmatter. Never reachable in a production build.
const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function resolvePostFile(slug: string): Promise<string | null> {
  for (const ext of [".mdx", ".md"]) {
    const file = path.resolve(BLOG_DIR, slug + ext);
    // Guard against path traversal: the resolved file must live under BLOG_DIR.
    if (!file.startsWith(BLOG_DIR + path.sep)) return null;
    try {
      await fs.access(file);
      return file;
    } catch {
      /* try next extension */
    }
  }
  return null;
}

function setFrontmatterField(raw: string, key: string, value: string): string {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error("Post has no frontmatter block");
  const keyRe = new RegExp(`^${key}:`);
  // Drop any existing line for this key, then append when a value is set.
  const lines = m[1].split("\n").filter((l) => !keyRe.test(l));
  if (value !== "") lines.push(`${key}: ${JSON.stringify(value)}`);
  return raw.replace(m[0], `---\n${lines.join("\n")}\n---`);
}

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) return json({ error: "Not available" }, 403);

  let body: { slug?: string; seed?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const slug = (body.slug ?? "").trim();
  const seed = (body.seed ?? "").trim();
  if (!slug) return json({ error: "Missing slug" }, 400);

  const file = await resolvePostFile(slug);
  if (!file) return json({ error: `Post not found: ${slug}` }, 404);

  try {
    const raw = await fs.readFile(file, "utf-8");
    const next = setFrontmatterField(raw, "bannerSeed", seed);
    await fs.writeFile(file, next, "utf-8");
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }

  return json({ ok: true, slug, seed: seed || null });
};
