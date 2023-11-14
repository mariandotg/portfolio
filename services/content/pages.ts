import { GITHUB_TOKEN } from '@/config';

export const fetchPageByPath = async <T>(
  path: string,
  lang: string = 'en'
): Promise<T | undefined> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/mariandotg/portfolio-content/main/pages/${lang}/${path}.json`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'force-cache',
      next: {
        tags: ['pages'],
      },
    }
  );

  if (!response.ok) return undefined;

  const rawMDX: T = await response.json();

  if (rawMDX === '404: Not Found') return undefined;

  return rawMDX;
};
