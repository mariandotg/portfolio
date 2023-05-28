'use client';
import { SocialMedia } from '@/models/domain/SocialMedia';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

const PageIndex = () => {
  const headingsWithIdsRef = useRef<Element[]>([]);
  const navbarHeight = 64;
  const [headingsWithIds, setHeadingsWithIds] = useState<Element[]>([]);
  const path = usePathname();

  useEffect(() => {
    const headingsWithIds = Array.from(document.querySelectorAll('h2[id]'));
    setHeadingsWithIds(headingsWithIds);
    headingsWithIdsRef.current = headingsWithIds;
  }, []);

  const scrollToHeading = (index: number) => {
    const heading = headingsWithIdsRef.current[index];
    if (heading instanceof HTMLElement) {
      const topOffset = heading.offsetTop - navbarHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

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
        icon: 'linkedin',
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

  return (
    <div className='sticky hidden col-span-1 top-[73px] h-fit mobile:flex mobile:flex-col gap-y-4'>
      <div className='flex flex-col p-4 border rounded gap-y-2 border-primary'>
        <h3 className='italic font-medium font-monospace dark:text-dark-headlines text-light-headlines'>
          Content
        </h3>
        {headingsWithIds.map((heading, index) => (
          <span
            key={index}
            className='italic font-medium underline cursor-pointer text-secondary font-monospace text-primary underline-offset-2 w-fit'
            onClick={() => scrollToHeading(index)}
          >
            {heading.textContent}
          </span>
        ))}
      </div>
      <div className='flex justify-between p-4 border rounded gap-x-2 border-primary'>
        <ul className='flex gap-x-2'>
          {generateSocialMediaLinks(
            `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}${path}`
          ).map((social) => (
            <li key={social.id} className='flex'>
              <a
                href={social.url}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.alt}
              >
                <Icon
                  value={social.icon.toLocaleLowerCase()}
                  className='duration-[0ms] fill-light-text dark:fill-dark-text hover:fill-primary dark:hover:fill-primary'
                />
              </a>
            </li>
          ))}
        </ul>
        <Icon
          value='url'
          className='duration-[0ms] fill-light-text dark:fill-dark-text hover:fill-primary dark:hover:fill-primary'
        />
      </div>
    </div>
  );
};

export default PageIndex;
