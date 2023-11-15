import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const POST = async (request: NextRequest) => {
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
  const pathsSet = new Set();

  body.commits[0].modified.forEach((edits: string) => {
    if (edits.startsWith('projects')) {
      tagsSet.add('projects-en');
      tagsSet.add('projects-es');

      pathsSet.add('/[lang]/projects');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('articles')) {
      tagsSet.add('articles-en');
      tagsSet.add('articles-es');

      pathsSet.add('/[lang]/blog');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('social-media')) {
      tagsSet.add('social-media');

      pathsSet.add('/[lang]');
    }
  });
  body.commits[0].added.forEach((edits: string) => {
    if (edits.startsWith('projects')) {
      tagsSet.add('projects-en');
      tagsSet.add('projects-es');

      pathsSet.add('/[lang]/projects');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('articles')) {
      tagsSet.add('articles-en');
      tagsSet.add('articles-es');

      pathsSet.add('/[lang]/blog');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('social-media')) {
      tagsSet.add('social-media');

      pathsSet.add('/[lang]');
    }
  });
  body.commits[0].removed.forEach((edits: string) => {
    if (edits.startsWith('projects')) {
      tagsSet.add('projects-en');
      tagsSet.add('projects-es');

      pathsSet.add('/[lang]/projects');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('articles')) {
      tagsSet.add('articles-en');
      tagsSet.add('articles-es');

      pathsSet.add('/[lang]/blog');
      pathsSet.add('/[lang]');
    } else if (edits.startsWith('social-media')) {
      tagsSet.add('social-media');

      pathsSet.add('/[lang]');
    }
  });

  const arrayTags = Array.from(tagsSet) as string[];
  const arrayPaths = Array.from(pathsSet) as string[];
  console.log({ arrayTags, arrayPaths });

  // arrayTags.forEach((tag) => {
  //   revalidateTag(tag);
  // });
  arrayPaths.forEach((tag) => {
    revalidatePath(tag);
  });

  return NextResponse.json({ revalidated: true });
};
