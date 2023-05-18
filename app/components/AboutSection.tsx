import React from 'react';

import { MdArrowOutward } from 'react-icons/md';

import { pageConstantsAdapter } from '@/adapters/pageConstantsAdapter';
import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { IPage, IConstants } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';

import Section from './Section';
import Button from './Button';
import Icon from './Icon';

const AboutSection = async () => {
  const { about } = await getContentfulData<IPage>({
    locale: 'en',
    type: 'page',
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  const social = await getContentfulData<IConstants>({
    locale: 'en',
    type: 'constants',
  }).then((data) => pageConstantsAdapter(data[0].fields));

  return (
    <Section>
      <div className='flex flex-col col-span-3 gap-y-4'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
            {about?.title}
          </h1>
          <ul className='flex gap-x-4'>
            {social.social.map((social) => (
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
        </div>
        <p className='font-display text text-light-text dark:text-dark-text'>
          {about?.content.description.text}
        </p>
      </div>
      <div className='flex flex-col gap-4 tablet:col-start-2 tablet:gap-4 mobile:col-span-2 mobile:grid mobile:grid-cols-2'>
        <Button
          variant={about?.content.secondaryCta.variant}
          url={about?.content.secondaryCta.url}
          className='tablet:col-span-1'
        >
          {about?.content.secondaryCta.label}
          <MdArrowOutward />
        </Button>
        <Button
          variant={about?.content.cta.variant}
          url={about?.content.cta.url}
          className='tablet:col-span-1'
        >
          {about?.content.cta.label}
          <Icon value='mail' />
        </Button>
      </div>
    </Section>
  );
};

export default AboutSection;
