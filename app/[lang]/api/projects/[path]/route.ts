import { projectsAdapter } from '@/adapters/projectsAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { getPageData } from '@/services/notion';
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
    ],
  };

  const projectResponse = await getPageData(
    {
      databaseId,
      filter: projectFilter,
    },
    { seo: true, properties: { adapter: projectsAdapter }, content: true }
  );

  return NextResponse.json(projectResponse);
}
