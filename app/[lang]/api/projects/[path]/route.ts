import { projectsAdapter } from '@/adapters/projectsAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { getPageData } from '@/services/notion';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const projectFilter: CompoundFilterObj = {
    and: [
      {
        property: 'SeoPath',
        formula: {
          string: {
            equals: path,
          },
        },
      },
      {
        property: 'Locale',
        select: {
          equals: lang,
        },
      },
    ],
  };

  const projectResponse = await getPageData(
    {
      databaseId,
      filter: projectFilter,
      pageSize: 1,
    },
    { seo: true, properties: { adapter: projectsAdapter }, content: true }
  );

  return projectResponse === false
    ? notFound()
    : NextResponse.json(projectResponse);
}
