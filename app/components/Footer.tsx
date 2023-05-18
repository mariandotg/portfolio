import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

import PageLayout from './PageLayout';
import Icon from './Icon';
import { IConstants } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';
import { pageConstantsAdapter } from '@/adapters/pageConstantsAdapter';

const Footer = async () => {
  const constants = await getContentfulData<IConstants>({
    locale: 'en',
    type: 'constants',
  }).then((data) => pageConstantsAdapter(data[0].fields));

  return (
    <footer className='w-full flex flex-col gap-y-16 py-8 border-t-[1px] border-primary'>
      <PageLayout>
        <div className='grid grid-cols-1 gap-8 mobile:grid-cols-3'>
          <div className='col-span-1'>
            <h3 className='font-medium text-title whitespace-nowrap font-display dark:text-dark-headlines text-light-headlines'>
              {constants.text.ctaEmail.text}
            </h3>
            <a
              href={constants.text.email.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex relative text-title w-fit before:content-[""] before:h-[1px] before:w-full before:left-0 before:bottom-1 before:absolute before:bg-primary items-center font-medium gap-x-1 font-display text-primary'
            >
              {constants.text.email.text}
              <MdArrowOutward />
            </a>
          </div>
          <div className='grid grid-cols-2 col-span-1 mobile:flex mobile:flex-col mobile:col-start-3 gap-y-4'></div>
        </div>
        <div className='flex flex-col items-center gap-y-8'>
          <ul className='flex justify-center w-full gap-4 text-light-text dark:text-dark-text'>
            {constants.social.map((social) => (
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
          <div className='flex flex-col items-center w-full italic h-fit gap-y-2 font-monospace text-light-headlines dark:text-dark-headlines'>
            <p className='flex items-center gap-x-2 text-secondary'>
              Made in Buenos Aires, Argentina
            </p>
            <span className='text-secondary '>2023 © Mariano Guillaume</span>
          </div>
        </div>
      </PageLayout>
    </footer>
  );
};

export default Footer;
