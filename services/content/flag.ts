import { Flag } from '@/components/Notification';
import { GITHUB_TOKEN } from '@/config';

interface NotificationFlags {
  [index: string]: Flag;
}

export const fetchFlag = async (): Promise<NotificationFlags | undefined> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/mariandotg/portfolio-content/main/notification-flag.json`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-cache',
      next: {
        tags: ['notification-flag'],
      },
    }
  );

  if (!response.ok) return undefined;

  const rawMDX: NotificationFlags = await response.json();

  //@ts-ignore
  if (rawMDX === '404: Not Found') return undefined;

  return rawMDX;
};
