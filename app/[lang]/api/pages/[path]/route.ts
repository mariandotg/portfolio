import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { IPage } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';
import { getPageData } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const data = await getContentfulData<IPage>({
    content_type: 'page',
    locale: lang,
    include: 3,
    ['fields.name']: path,
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  const seo = await getPageData(
    {
      databaseId,
      filter: {
        property: 'SeoPath',
        formula: {
          string: {
            equals: path,
          },
        },
      },
    },
    { seo: true, properties: false, content: false }
  );

  return NextResponse.json({ ...data, ...seo });
}
