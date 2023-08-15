import { rawsToPreviewProjects } from '@/adapters/rawToPreviewAdapters';
import { fetchProjects } from '@/services/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const data = await fetchProjects(lang);
  const projects = rawsToPreviewProjects(data);

  return NextResponse.json({ projects });
}
