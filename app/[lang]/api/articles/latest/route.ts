import { rawPreviewArticlesAdapter } from '@/adapters/rawPreviewArticlesAdapter';
import { getLatestArticles } from '@/services/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const data = await getLatestArticles(lang);
  const articles = rawPreviewArticlesAdapter(data);

  return NextResponse.json([...articles]);
}
