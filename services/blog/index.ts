/*
TODO: Método para obtener latest articles (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc

TODO: Método para obtener los articles (paginados) (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path

TODO: Método para obtener el article individual (todo)
http://localhost:1337/api/articles/1?populate[image]=*&populate[localizations][fields][1]=title
*/

import { NEXT_PUBLIC_API_URL } from '@/config';
import {
  RawFullArticle,
  RawFullProject,
  RawPage,
  RawPreviewArticle,
  RawPreviewProject,
} from '@/models/blog/blog.models';

export const fetchArticles = async (
  locale: string = 'en'
): Promise<RawPreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();

  return data as RawPreviewArticle[];
};

export const fetchProjects = async (
  locale: string = 'en'
): Promise<RawPreviewProject[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/projects?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=tags&fields[3]=path`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();

  return data as RawPreviewProject[];
};

export const fetchLatestArticles = async (
  locale: string = 'en'
): Promise<RawPreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();

  return data as RawPreviewArticle[];
};

export const fetchFeaturedProjects = async (
  locale: string = 'en'
): Promise<RawPreviewProject[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/projects?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=tags&fields[3]=path&pagination[pageSize]=3&filters[featured][$eq]=true`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();

  return data as RawPreviewProject[];
};

export const fetchContentByPath = async <
  T extends RawFullArticle[] | RawPage[] | RawFullProject[]
>(
  contentType: string,
  lang: string,
  path: string
): Promise<T> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/${contentType}?locale=${lang}&filters[path][$eq]=${path}&populate[image]=*&populate[localizations][fields][1]=locale`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();

  return data as T;
};
