import { CompoundFilterObj } from '@/models/notion/Filters';
import { getPageData } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const articleFilter: CompoundFilterObj = {
    and: [
      {
        property: 'Stage',
        select: {
          equals: 'Published',
        },
      },
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

  const articleResponse = await getPageData(
    {
      databaseId,
      filter: articleFilter,
    },
    { seo: true, properties: true, content: true }
  );

  return NextResponse.json(articleResponse);
}
