import { projectsAdapter } from '@/adapters/projectsAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { queryDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const featuredProjectsFilter: CompoundFilterObj = {
    and: [
      {
        property: 'Stage',
        select: {
          equals: 'Published',
        },
      },
      {
        property: 'Database',
        select: {
          equals: 'Projects Database',
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

  const featuredProjectsResponse = await queryDatabase({
    databaseId,
    filter: featuredProjectsFilter,
    pageSize: 4,
  });

  const featuredProjects = projectsAdapter(featuredProjectsResponse);

  return NextResponse.json([...featuredProjects]);
}
