import { fetchArticles } from '@/services/content/articles';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const articles = await fetchArticles(lang);
  const latestArticles = articles?.slice(0, 2);

  //@ts-ignore
  return NextResponse.json([...latestArticles]);
}
