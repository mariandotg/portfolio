import { projectsAdapter } from '@/adapters/projectsAdapter';
import { rawsToPreviewProjects } from '@/adapters/rawToPreviewAdapters';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { fetchFeaturedProjects } from '@/services/blog';
import { queryDatabase } from '@/services/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const data = await fetchFeaturedProjects(lang);
  const featuredProjects = rawsToPreviewProjects(data);

  return NextResponse.json([...featuredProjects]);
}
