import { fetchArticles } from '@/services/content/articles';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const category = request.nextUrl.searchParams.get('category');

  const articles = await fetchArticles(lang);

  return NextResponse.json({ articles });
}
