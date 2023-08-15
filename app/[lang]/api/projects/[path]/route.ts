import { projectsAdapter } from '@/adapters/projectsAdapter';
import {
  rawToFullArticle,
  rawToFullProject,
} from '@/adapters/rawToFullAdapter';
import { RawFullArticle, RawFullProject } from '@/models/blog/blog.models';
import { fetchContentByPath } from '@/services/blog';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const path = request.nextUrl.pathname.split('/').filter(Boolean)[3];

  const data = await fetchContentByPath<RawFullProject[]>(
    'projects',
    lang,
    path
  );
  const projectResponse = rawToFullProject(data[0]);
  //@ts-ignore
  return projectResponse === false
    ? notFound()
    : NextResponse.json(projectResponse);
}
