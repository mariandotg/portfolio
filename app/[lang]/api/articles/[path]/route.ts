import { articlesAdapter } from '@/adapters/articlesAdapter';
import { pageSeoAdapter } from '@/adapters/pageSeoAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { getNotionSinglePage, queryNotionDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const articlesFilter: CompoundFilterObj = {
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
      {
        property: 'Database',
        select: {
          equals: 'Articles Database',
        },
      },
    ],
  };

  const blogResponse = await getNotionSinglePage({
    databaseId,
    filter: articlesFilter,
  });

  const seoResponse = await queryNotionDatabase({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: path,
        },
      },
    },
  });

  const seo = pageSeoAdapter(seoResponse[0]);
  const metadata = articlesAdapter(seoResponse)[0];
  const { markdown } = blogResponse;

  return NextResponse.json({ markdown, seo, metadata });
}
