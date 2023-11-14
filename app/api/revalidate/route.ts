import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const tag = request.nextUrl.searchParams.get('tag') || '/';
  const body = await request.json();

  console.log({ body });
  console.log({ AAAAAAAASDDDDDDDDDDDD: tag });

  const tagsSet = new Set();

  body.commits[0].modified.forEach((edits: string) => {
    const en = edits.includes('/en/') && 'en';
    const es = edits.includes('/es/') && 'es';
    if (edits.startsWith('projects')) {
      tagsSet.add(`projects-${en ? en : es}`);
    } else if (edits.startsWith('articles')) {
      tagsSet.add(`articles-${en ? en : es}`);
    }
  });
  body.commits[0].added.forEach((edits: string) => {
    const en = edits.includes('/en/') && 'en';
    const es = edits.includes('/es/') && 'es';
    if (edits.startsWith('projects')) {
      tagsSet.add(`projects-${en ? en : es}`);
    } else if (edits.startsWith('articles')) {
      tagsSet.add(`articles-${en ? en : es}`);
    }
  });
  body.commits[0].removed.forEach((edits: string) => {
    const en = edits.includes('/en/') && 'en';
    const es = edits.includes('/es/') && 'es';
    if (edits.startsWith('projects')) {
      tagsSet.add(`projects-${en ? en : es}`);
    } else if (edits.startsWith('articles')) {
      tagsSet.add(`articles-${en ? en : es}`);
    }
  });

  const array = Array.from(tagsSet) as string[];
  console.log({ tagsSet, array });

  array.forEach((tag) => {
    revalidateTag(tag);
  });

  return NextResponse.json({ revalidated: true });
}
