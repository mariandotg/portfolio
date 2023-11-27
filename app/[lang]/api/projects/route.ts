import { fetchProjects } from '@/services/content/projects';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];

  const projects = await fetchProjects(lang);

  return NextResponse.json({ projects });
}
