import { articlesAdapter } from '@/adapters/articlesAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { queryDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
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
    ],
  };

  const articlesResponse = await queryDatabase({
    databaseId,
    filter: articlesFilter,
  });

  const articles = articlesAdapter(articlesResponse);

  return NextResponse.json({ articles });
}
