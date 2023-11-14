import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import NavLink from './NavLink';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { fetchSocialMedia } from '@/services/content/social-media';
import Icon from './icons/Icon';

interface Props {
  locale: string;
}

const Footer = async ({ locale }: Props) => {
  const constants = await fetchSocialMedia();

  const dict = await getDictionary(locale);

  return (
    <footer className='w-full flex flex-col gap-y-16 py-8 border-t-[1px] border-light-subtle-edges dark:border-dark-subtle-edges relative z-0'>
      <div className='flex justify-center'>
        <div className='flex flex-col w-screen gap-16 px-4 tablet:max-w-2xl tablet:p-0'>
          <div className='grid grid-cols-1 gap-8 px-4 mobile:grid-cols-4'>
            {/* <div className='col-span-1'>
              <h3 className='font-medium text-title whitespace-nowrap font-display dark:text-dark-headlines text-light-headlines'>
                {dict.footer.emailCta}
              </h3>
              <a
                href={dict.footer.email}
                target='_blank'
                rel='noopener noreferrer'
                className='relative flex items-center italic font-medium underline rounded dark:hover:text-primary hover:text-primary decoration-primary group underline-offset-4 text-title w-fit font-monospace dark:text-dark-headlines text-light-headlines'
              >
                marianguillaume.m@gmail.com
                <MdArrowOutward className='w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 fill-primary' />
              </a>
            </div> */}
            {/* <div className='grid grid-cols-2 col-span-1 mobile:flex mobile:flex-col mobile:col-start-4 gap-y-4'>
              <NavLink href={`/${locale}`}>{dict.routes['/']}</NavLink>
              <NavLink href={`/${locale}/projects`}>
                {dict.routes['/projects']}
              </NavLink>
              <NavLink href={`/${locale}/blog`}>{dict.routes['/blog']}</NavLink>
              <NavLink href={`/${locale}/contact`}>
                {dict.routes['/contact']}
              </NavLink>
            </div> */}
          </div>
          <div className='flex flex-col items-center gap-y-8'>
            <ul className='flex justify-center w-full gap-4 text-light-text dark:text-dark-text'>
              {constants!.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.alt}
                  >
                    <Icon
                      value={social.icon}
                      width={20}
                      height={20}
                      className='duration-[0ms] text-light-text dark:text-dark-text hover:text-light-text-dark-secondary dark:hover:text-dark-secondary'
                    />
                  </a>
                </li>
              ))}
            </ul>
            <div className='flex flex-col items-center w-full italic h-fit gap-y-2 font-monospace'>
              <p className='flex items-center gap-x-2 text-secondary text-light-headlines dark:text-dark-headlines'>
                {dict.footer.madeIn}
              </p>
              <span className='text-secondary text-light-headlines dark:text-dark-headlines'>
                {dict.footer.copyright}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
