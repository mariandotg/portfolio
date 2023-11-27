import { fetchArticleByPath } from '@/services/content/articles';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];

  const data = await fetchArticleByPath(path, lang);

  return data === undefined ? notFound() : NextResponse.json(data);
}
