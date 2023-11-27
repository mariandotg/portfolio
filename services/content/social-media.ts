import { GITHUB_TOKEN } from '@/config';
import { SocialMedia } from '@/models/domain/SocialMedia';

export const fetchSocialMedia = async (): Promise<
  SocialMedia[] | undefined
> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/mariandotg/portfolio-content/main/social-media.json`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'force-cache',
      next: {
        tags: ['social-media'],
      },
    }
  );

  if (!response.ok) return undefined;

  const rawMDX: SocialMedia[] = await response.json();

  return rawMDX;
};
