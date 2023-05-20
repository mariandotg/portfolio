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
              className='relative flex items-center italic font-medium underline rounded dark:hover:text-primary hover:text-primary decoration-primary group underline-offset-4 text-title w-fit font-monospace dark:text-dark-headlines text-light-headlines'
            >
              {constants.text.email.text}
              <MdArrowOutward
                fontStyle={'italic'}
                className='w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 fill-primary'
              />
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
          <div className='flex flex-col items-center w-full italic h-fit gap-y-2 font-monospace'>
            <p className='flex items-center gap-x-2 text-secondary text-light-headlines dark:text-dark-headlines'>
              Made in Buenos Aires, Argentina
            </p>
            <span className='text-secondary text-light-headlines dark:text-dark-headlines'>
              2023 © Mariano Guillaume
            </span>
          </div>
        </div>
      </PageLayout>
    </footer>
  );
};

export default Footer;
