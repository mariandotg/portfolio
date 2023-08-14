import { rawsToPreviewArticles } from '@/adapters/rawToPreviewAdapters';
import { fetchLatestArticles } from '@/services/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const data = await fetchLatestArticles(lang);
  const articles = rawsToPreviewArticles(data);

  return NextResponse.json([...articles]);
}
