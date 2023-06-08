import { articlesAdapter } from '@/adapters/articlesAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { getPageData } from '@/services/notion';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  console.log('lang blog article', lang, 'path', path);
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
      {
        property: 'Locale',
        select: {
          equals: lang,
        },
      },
    ],
  };

  const articleResponse = await getPageData(
    {
      databaseId,
      filter: articleFilter,
      pageSize: 1,
    },
    { seo: true, properties: { adapter: articlesAdapter }, content: true }
  );

  return articleResponse === false
    ? notFound()
    : NextResponse.json(articleResponse);
}
