import { NEXT_PUBLIC_BASE_FETCH_URL } from '@/config';
import { redirect } from 'next/navigation';

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
