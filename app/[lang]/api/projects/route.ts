import { projectsAdapter } from '@/adapters/projectsAdapter';
import { CompoundFilterObj, FilterObj } from '@/models/notion/Filters';
import { queryDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

const createFiltersFromParam = (
  searchParams: URLSearchParams,
  param: string
) => {
  const tags = searchParams.get(param);

  const values = tags?.split(',');
  const filters = values?.reduce<Array<FilterObj<{ [key: string]: unknown }>>>(
    (acc, currValue) => {
      return [
        ...acc,
        {
          property: 'Tags',
          multi_select: {
            contains: currValue,
          },
        },
      ];
    },
    []
  );

  return filters || [];
};

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const tagsFilters = createFiltersFromParam(
    request.nextUrl.searchParams,
    'tags'
  );

  const projectsFilter: CompoundFilterObj = {
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
      ...tagsFilters,
    ],
  };

  const projectsResponse = await queryDatabase({
    databaseId,
    filter: projectsFilter,
    pageSize: 10,
  });

  const projects = projectsAdapter(projectsResponse);

  return NextResponse.json({ projects });
}
