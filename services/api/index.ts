import { NEXT_PUBLIC_BASE_FETCH_URL } from '@/config';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchContentByPath } from '../blog';
import { RawPage } from '@/models/blog/blog.models';
import { rawToFull } from '@/adapters/rawToFullAdapter';
import { metadataAdapter } from '@/adapters/metadataAdapter';

export const getArticle = async (lang: string, path: string): Promise<any> => {
  const response = await fetch(
    `${NEXT_PUBLIC_BASE_FETCH_URL}/${lang}/api/articles/${path}`,
    { cache: 'no-cache' }
  );
  if (!response.ok) {
    return redirect(`../../en/blog/not-found`);
    throw new Error('api error');
  }
  const data = await response.json();

  return data;
};

export const getPageMetadata = async (
  lang: string,
  path: string
): Promise<Metadata> => {
  const response = await fetchContentByPath<RawPage>('pages', lang, path);
  const articleFetch = rawToFull(response[0]);

  //@ts-ignore
  const articleResponse: ArticleData = articleFetch;

  return metadataAdapter(articleResponse.seo);
};
