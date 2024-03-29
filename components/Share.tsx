'use client';
import { SocialMedia } from '@/models/domain/SocialMedia';
import { usePathname } from 'next/navigation';
import Icon from './icons/Icon';

const Share = () => {
  const path = usePathname();
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}${path}`;

  function generateSocialMediaLinks(url: string): SocialMedia[] {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
      url
    )}`;

    const socialMediaLinks: SocialMedia[] = [
      {
        url: twitterUrl,
        icon: 'twitter',
        alt: 'Twitter',
        id: 'twitter',
      },
      {
        url: linkedInUrl,
        icon: 'linkedIn',
        alt: 'LinkedIn',
        id: 'linkedin',
      },
      {
        url: facebookUrl,
        icon: 'facebook',
        alt: 'Facebook',
        id: 'facebook',
      },
      {
        url: redditUrl,
        icon: 'reddit',
        alt: 'Reddit',
        id: 'reddit',
      },
    ];

    return socialMediaLinks;
  }

  const copyToClipboard = (string: string) => {
    navigator.clipboard.writeText(string);
  };

  return (
    <ul className='flex gap-x-4'>
      {generateSocialMediaLinks(pageUrl).map((social) => (
        <li key={social.id} className='flex'>
          <a
            href={social.url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={social.alt}
          >
            <Icon
              value={social.icon}
              className='duration-[0ms] text-light-text dark:text-dark-text hover:text-light-text-dark-secondary dark:hover:text-dark-secondary'
              width={20}
              height={20}
            />
          </a>
        </li>
      ))}
      <li className='cursor-pointer' onClick={() => copyToClipboard(pageUrl)}>
        <Icon
          value='link'
          className='duration-[0ms] text-light-text dark:text-dark-text hover:text-light-text-dark-secondary dark:hover:text-dark-secondary'
          width={20}
          height={20}
        />
      </li>
    </ul>
  );
};

export default Share;
