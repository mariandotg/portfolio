import { fetchProjects } from '@/services/content/projects';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const projects = await fetchProjects(lang);
  const featuredProjects = projects?.slice(0, 2);

  //@ts-ignore
  return NextResponse.json([...featuredProjects]);
}
