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

  console.log(body.payload.commits[0].modified);
  console.log({ AAAAAAAASDDDDDDDDDDDD: tag });

  const tagsSet = new Set();

  body.payload.commits[0].modified.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });
  body.payload.commits[0].added.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });
  body.payload.commits[0].removed.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });

  const array = Array.from(tagsSet) as string[];
  console.log({ tagsSet, array });

  array.forEach((tag) => {
    revalidateTag(tag);
  });

  return NextResponse.json({ revalidated: true });
}
