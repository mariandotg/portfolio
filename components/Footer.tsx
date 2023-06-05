import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

import Icon from './Icon';
import NavLink from './NavLink';
import { PageConstants } from '@/models/PageConstants';
import { getDictionary } from '@/app/[lang]/dictionaries';

interface Props {
  locale: string;
}

const Footer = async ({ locale }: Props) => {
  const socialFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${locale}/api/social`
  );

  const constants: PageConstants = await socialFetch.json();

  const dict = await getDictionary(locale);
  console.log(constants);
  return (
    <footer className='w-full flex flex-col gap-y-16 py-8 border-t-[1px] border-primary'>
      <div className='flex justify-center'>
        <div className='flex flex-col w-screen tablet:max-w-[800px] px-4 tablet:p-0 gap-16'>
          <div className='grid grid-cols-1 gap-8 mobile:grid-cols-3'>
            <div className='col-span-1'>
              <h3 className='font-medium text-title whitespace-nowrap font-display dark:text-dark-headlines text-light-headlines'>
                {dict.footer.emailCta}
              </h3>
              <a
                href={dict.footer.email}
                target='_blank'
                rel='noopener noreferrer'
                className='relative flex items-center italic font-medium underline rounded dark:hover:text-primary hover:text-primary decoration-primary group underline-offset-4 text-title w-fit font-monospace dark:text-dark-headlines text-light-headlines'
              >
                {dict.footer.email}
                <MdArrowOutward className='w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 fill-primary' />
              </a>
            </div>
            <div className='grid grid-cols-2 col-span-1 mobile:flex mobile:flex-col mobile:col-start-3 gap-y-4'>
              <NavLink href={`/${locale}`}>Portfolio</NavLink>
              <NavLink href={`/${locale}/projects`}>Proyectos</NavLink>
              <NavLink href={`/${locale}/blog`}>Blog</NavLink>
            </div>
          </div>
          <div className='flex flex-col items-center gap-y-8'>
            <ul className='flex justify-center w-full gap-4 text-light-text dark:text-dark-text'>
              {constants.map((social) => (
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
