import { NEXT_PUBLIC_BASE_FETCH_URL } from '@/config';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchContentByPath } from '../blog';
import {
  FullArticle,
  FullProject,
  PreviewArticle,
  RawPage,
} from '@/models/blog/blog.models';
import { rawToFullArticle } from '@/adapters/rawToFullAdapter';
import { metadataAdapter } from '@/adapters/metadataAdapter';

export const getArticle = async (
  lang: string,
  path: string
): Promise<FullArticle> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/articles/${path}`,
    { cache: 'no-cache' }
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
    { cache: 'no-cache' }
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
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have articles error');
  }
  const { articles } = await response.json();

  return articles as PreviewArticle[];
};

export const getLatestArticles = async (
  lang: string
): Promise<PreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/latest-articles`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('doesn`t have latest articles error');
  }
  const articles = await response.json();

  return articles as PreviewArticle[];
};

export const getPageMetadata = async (
  lang: string,
  path: string
): Promise<Metadata> => {
  const response = await fetchContentByPath<RawPage>('pages', lang, path);
  //@ts-ignore
  const articleFetch = rawToFullArticle(response[0]);

  //@ts-ignore
  const articleResponse: ArticleData = articleFetch;

  return metadataAdapter(articleResponse.seo);
};

export const getArticleMetadata = async (
  lang: string,
  path: string
): Promise<Metadata> => {
  const article = await getArticle(lang, path);

  return metadataAdapter(article.seo);
};
