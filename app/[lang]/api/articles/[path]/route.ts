import { rawFullArticleAdapter } from '@/adapters/rawFullArticleAdapter';
import { getArticle } from '@/services/blog';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];

  // @ts-ignore
  const data = await getArticle(path);
  const articleResponse = rawFullArticleAdapter(data);

  return articleResponse === false
    ? notFound()
    : NextResponse.json(articleResponse);
}
