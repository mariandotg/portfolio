import { pageConstantsAdapter } from '@/adapters/pageConstantsAdapter';
import { IConstants } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const data = await getContentfulData<IConstants>({
    locale: lang,
    content_type: 'constants',
    include: 3,
  }).then((data) => pageConstantsAdapter(data[0].fields));

  return NextResponse.json({ ...data });
}
