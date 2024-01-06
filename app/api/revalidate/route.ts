import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const runtime = 'edge';

export const POST = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get('secret');
  const tagsSet = new Set();

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

  // console.log({ body });
  console.log({ AAAAAAAASDDDDDDDDDDDD: tag });

  try {
    const body = await request.json();
    console.log({ body });

    body.commits[0].modified.forEach((edits: any) => {
      if (edits.startsWith('projects')) {
        // tagsSet.add('projects-en');
        // tagsSet.add('projects-es');

        const content = edits.split('/');

        tagsSet.add('/[lang]/projects');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/${content[1]}`);
      } else if (edits.startsWith('articles')) {
        // tagsSet.add('articles-en');
        // tagsSet.add('articles-es');

        const content = edits.split('/');

        tagsSet.add('/[lang]/blog');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/blog/${content[1]}`);
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('/[lang]');
      } else if (edits.startsWith('pages')) {
        const content = edits.split('/');

        if (content[2] === 'home') {
          tagsSet.add(`/[lang]`);
        } else {
          tagsSet.add(`/[lang]/${content[2]}`);
        }
      }
    });
    body.commits[0].added.forEach((edits: any) => {
      if (edits.startsWith('projects')) {
        // tagsSet.add('projects-en');
        // tagsSet.add('projects-es');

        const content = edits.split('/');
        tagsSet.add('/[lang]/projects');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/${content[1]}`);
      } else if (edits.startsWith('articles')) {
        // tagsSet.add('articles-en');
        // tagsSet.add('articles-es');

        const content = edits.split('/');
        tagsSet.add('/[lang]/blog');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/blog/${content[1]}`);
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('/[lang]');
      } else if (edits.startsWith('pages')) {
        const content = edits.split('/');

        if (content[2] === 'home') {
          tagsSet.add(`/[lang]`);
        } else {
          tagsSet.add(`/[lang]/${content[2]}`);
        }
      }
    });
    body.commits[0].removed.forEach((edits: any) => {
      if (edits.startsWith('projects')) {
        // tagsSet.add('projects-en');
        // tagsSet.add('projects-es');

        const content = edits.split('/');
        tagsSet.add('/[lang]/projects');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/${content[1]}`);
      } else if (edits.startsWith('articles')) {
        // tagsSet.add('articles-en');
        // tagsSet.add('articles-es');

        const content = edits.split('/');
        tagsSet.add('/[lang]/blog');
        tagsSet.add('/[lang]');
        tagsSet.add(`/[lang]/blog/${content[1]}`);
      } else if (edits.startsWith('social-media')) {
        tagsSet.add('/[lang]');
      } else if (edits.startsWith('pages')) {
        const content = edits.split('/');

        if (content[2] === 'home') {
          tagsSet.add(`/[lang]`);
        } else {
          tagsSet.add(`/[lang]/${content[2]}`);
        }
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    const arrayTags = Array.from(tagsSet);
    arrayTags.forEach(async (tag) => {
      console.log('revalidated', tag);
      revalidatePath(tag as string, 'page');
    });
    return NextResponse.json({ revalidated: true });
  }
  //revalidatePath(tag, 'page');
  // const tagsSet = new Set<string>();
  // const pathsSet = new Set();

  // body.commits[0].modified.forEach((edits: string) => {
  //   if (edits.startsWith('projects')) {
  //     tagsSet.add('projects-en');
  //     tagsSet.add('projects-es');

  //     pathsSet.add('/[lang]/projects');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('articles')) {
  //     tagsSet.add('articles-en');
  //     tagsSet.add('articles-es');

  //     pathsSet.add('/[lang]/blog');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('social-media')) {
  //     tagsSet.add('social-media');

  //     pathsSet.add('/[lang]');
  //   }
  // });
  // body.commits[0].added.forEach((edits: string) => {
  //   if (edits.startsWith('projects')) {
  //     tagsSet.add('projects-en');
  //     tagsSet.add('projects-es');

  //     pathsSet.add('/[lang]/projects');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('articles')) {
  //     tagsSet.add('articles-en');
  //     tagsSet.add('articles-es');

  //     pathsSet.add('/[lang]/blog');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('social-media')) {
  //     tagsSet.add('social-media');

  //     pathsSet.add('/[lang]');
  //   }
  // });
  // body.commits[0].removed.forEach((edits: string) => {
  //   if (edits.startsWith('projects')) {
  //     tagsSet.add('projects-en');
  //     tagsSet.add('projects-es');

  //     pathsSet.add('/[lang]/projects');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('articles')) {
  //     tagsSet.add('articles-en');
  //     tagsSet.add('articles-es');

  //     pathsSet.add('/[lang]/blog');
  //     pathsSet.add('/[lang]');
  //   } else if (edits.startsWith('social-media')) {
  //     tagsSet.add('social-media');

  //     pathsSet.add('/[lang]');
  //   }
  // });

  // const arrayTags = Array.from(tagsSet) as string[];
  // const arrayPaths = Array.from(pathsSet) as string[];
  // console.log({ arrayTags, arrayPaths });

  // arrayTags.forEach((tag) => {
  //   revalidateTag(tag);
  // });
  // tagsSet.forEach((tag) => {
  //   revalidatePath(tag, 'page');
  // });

  return NextResponse.json({ revalidated: true });
};
