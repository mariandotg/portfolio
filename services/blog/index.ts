/*
TODO: Método para obtener latest articles (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc

TODO: Método para obtener los articles (paginados) (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path

TODO: Método para obtener el article individual (todo)
http://localhost:1337/api/articles/1?populate[image]=*&populate[localizations][fields][1]=title
*/

import { NEXT_PUBLIC_API_URL } from '@/config';
import { PreviewArticle, RawPreviewArticle } from '@/models/blog/blog.models';

const rawPreviewArticlesAdapter = (articles: RawPreviewArticle[]) => {
  return articles.map((article) => {
    const {
      id,
      attributes: { category, publishedAt, title, path, image: imageData },
    } = article;
    const image = {
      placeholder: imageData.data.attributes.placeholder,
      name: imageData.data.attributes.name,
      alternativeText: imageData.data.attributes.alternativeText,
      width: imageData.data.attributes.width,
      height: imageData.data.attributes.height,
      url: imageData.data.attributes.url,
    };
    return { path, title, publishedAt, category, id, image };
  });
};

export const getArticles = async (
  locale: string = 'en'
): Promise<PreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  const articles: RawPreviewArticle[] = data;

  return rawPreviewArticlesAdapter(articles);
};

export const getLatestArticles = async (
  locale: string = 'en'
): Promise<PreviewArticle[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=${locale}&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  const articles: RawPreviewArticle[] = data;

  return rawPreviewArticlesAdapter(articles);
};

export const getArticle = async (id: number) => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles/${id}?populate[image]=*&populate[localizations][fields][1]=title`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  return data;
};
