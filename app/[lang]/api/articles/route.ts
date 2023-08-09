import { articlesAdapter } from '@/adapters/articlesAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { queryDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const category = request.nextUrl.searchParams.get('category');
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const categoryFilter = category
    ? [
        {
          property: 'Category',
          select: {
            equals: category,
          },
        },
      ]
    : [];

  const articlesFilter: CompoundFilterObj = {
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
          equals: 'Articles Database',
        },
      },
      {
        property: 'Locale',
        select: {
          equals: lang,
        },
      },
      ...categoryFilter,
    ],
  };

  const articlesResponse = await queryDatabase({
    databaseId,
    filter: articlesFilter,
    pageSize: 10,
  });

  const articles = articlesAdapter(articlesResponse);

  return NextResponse.json({ articles });
}
