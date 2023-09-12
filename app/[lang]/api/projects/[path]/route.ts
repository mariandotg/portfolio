import { fetchProjectByPath } from '@/services/content/projects';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];

  const data = await fetchProjectByPath(path, lang);

  return data === undefined ? notFound() : NextResponse.json(data);
}
