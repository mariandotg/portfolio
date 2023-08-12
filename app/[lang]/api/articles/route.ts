import { rawsToPreviews } from '@/adapters/rawToPreviewAdapters';
import { fetchArticles } from '@/services/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const category = request.nextUrl.searchParams.get('category');

  const data = await fetchArticles(lang);
  const articles = rawsToPreviews(data);

  return NextResponse.json({ articles });
}
