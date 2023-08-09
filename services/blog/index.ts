/*
TODO: Método para obtener latest articles (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc

TODO: Método para obtener los articles (paginados) (minified: Title, Image, Category, Path, Id)
http://localhost:1337/api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path

TODO: Método para obtener el article individual (todo)
http://localhost:1337/api/articles/1?populate[image]=*&populate[localizations][fields][1]=title
*/

import { NEXT_PUBLIC_API_URL } from '@/config';

export const getArticles = async () => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  return data;
};

export const getLatestArticles = async () => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path&pagination[pageSize]=3&sort[0]=publishedAt:desc`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  return data;
};
