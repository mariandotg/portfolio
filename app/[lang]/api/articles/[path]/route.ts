import { rawToFullArticle } from '@/adapters/rawToFullAdapter';
import { RawFullArticle } from '@/models/blog/blog.models';
import { fetchContentByPath } from '@/services/blog';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];

  const data = await fetchContentByPath<RawFullArticle>('articles', lang, path);
  const articleResponse = rawToFullArticle(data[0]);

  return articleResponse === false
    ? notFound()
    : NextResponse.json(articleResponse);
}
