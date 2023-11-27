import { NEXT_PUBLIC_BASE_FETCH_URL } from '@/config';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  FullArticle,
  FullProject,
  PreviewArticle,
  PreviewProject,
} from '@/models/blog/blog.models';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { fetchArticleByPath } from '../content/articles';
import { fetchProjectByPath } from '../content/projects';

export const getArticle = async (
  lang: string,
  path: string
): Promise<FullArticle> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/articles/${path}`
  );
  if (!response.ok) {
    return redirect(`../../en/blog/not-found`);
    throw new Error('api error');
  }
  const data = await response.json();

  return data as FullArticle;
};

export const getProject = async (
  lang: string,
  path: string
): Promise<FullProject> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/projects/${path}`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    return redirect(`../../en/projects/not-found`);
    throw new Error('api error');
  }
  const data = await response.json();

  return data as FullProject;
};

export const getArticles = async (lang: string): Promise<PreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/articles`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have articles error');
  }
  const { articles } = await response.json();

  return articles as PreviewArticle[];
};

export const getProjects = async (lang: string): Promise<PreviewProject[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/projects`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have projects error');
  }
  const { projects } = await response.json();

  return projects as PreviewProject[];
};

export const getLatestArticles = async (
  lang: string
): Promise<PreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/latest-articles`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have latest articles error');
  }
  const articles = await response.json();

  return articles as PreviewArticle[];
};

export const getFeaturedProjects = async (
  lang: string
): Promise<PreviewProject[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/featured-projects`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have featured projects error');
  }
  const projects = await response.json();

  return projects as PreviewProject[];
};

export const getArticleMetadata = async (
  lang: string,
  path: string
): Promise<Metadata> => {
  const article = await fetchArticleByPath(path, lang);
  return metadataAdapter(article!.meta);
};

export const getProjectMetadata = async (
  lang: string,
  path: string
): Promise<Metadata> => {
  const project = await fetchProjectByPath(path, lang);
  return metadataAdapter(project!.meta);
};
