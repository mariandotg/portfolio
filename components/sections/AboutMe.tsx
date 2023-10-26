import React from 'react';
import { MdArrowOutward } from 'react-icons/md';
import Button from '../Button';
import Icon from '../Icon';
import Section from '../Section';
import { AboutContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import { SocialMedia } from '@/models/domain/SocialMedia';
import LinkButton from '../LinkButton';

interface Props {
  data: FormattedSection<AboutContent>;
  social: SocialMedia[] | undefined;
}

const AboutMe = ({ data, social }: Props) => {
  const renderSocials = () =>
    social!.map((social) => (
      <li key={social.id} className='flex'>
        <a
          href={social.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={social.alt}
        >
          <Icon
            value={social.icon.toLocaleLowerCase()}
            className='h-5 w-5 duration-[0ms] fill-light-text dark:fill-dark-text hover:fill-primary dark:hover:fill-primary'
          />
        </a>
      </li>
    ));

  return (
    <Section>
      <div className='flex flex-col col-span-4 gap-y-4 mt-36'>
        <div className='flex items-center gap-x-4'>
          <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
            {data.title}
          </h1>
          <ul className='flex gap-x-4'>{renderSocials()}</ul>
        </div>
        <p className='font-display text text-light-text dark:text-dark-text'>
          {data.content.description.text}
        </p>
      </div>
      <div className='flex flex-col gap-4 tablet:col-start-3 tablet:gap-4 mobile:col-span-2 mobile:grid mobile:grid-cols-2'>
        <LinkButton
          href={data.content.secondaryCta.url!!}
          className='tablet:w-full'
        >
          {data.content.secondaryCta.label}
          <MdArrowOutward />
        </LinkButton>
        <LinkButton href={data.content.cta.url!!} className='tablet:w-full'>
          {data.content.cta.label}
          <Icon value='mail' />
        </LinkButton>
      </div>
    </Section>
  );
};

export default AboutMe;
