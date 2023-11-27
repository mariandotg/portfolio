import React from 'react';
import Section from './Section/Section';
import { AboutContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import { SocialMedia } from '@/models/domain/SocialMedia';
import LinkButton from '../LinkButton';
import Icon from '../icons/Icon';
import BrandLogo from '../../public/public/logo-v2-4.svg';
import NavLogo from '../BodyLogoWrapper';
import BodyLogoWrapper from '../BodyLogoWrapper';

interface Props {
  data: FormattedSection<AboutContent>;
  social: SocialMedia[] | undefined;
}

const AboutMe = ({ data, social }: Props) => {
  const renderSocials = () =>
    social!.map((social) => (
      <li
        key={social.id}
        className='flex text-light-text duration-[0ms] dark:text-dark-text hover:text-primary dark:hover:text-primary'
      >
        <a
          href={social.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={social.alt}
        >
          <Icon value={social.icon} width={20} height={20} />
        </a>
      </li>
    ));

  return (
    <Section>
      <div className='flex flex-col col-span-4 gap-y-4'>
        <div className='flex items-center gap-x-4'>
          {/* <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
            {data.title}
          </h1>*/}
          <BodyLogoWrapper>
            <BrandLogo
              className='flex tablet:dark:flex w-[164px] fill-dark dark:fill-light group-hover:fill-primary sticky mr-auto'
              alt='brand marianoGuillaume logo'
            />
          </BodyLogoWrapper>
          <ul className='flex gap-x-3'>{renderSocials()}</ul>
        </div>
        <p className='font-display text text-light-text dark:text-dark-text'>
          {data.content.description.text}
        </p>
      </div>
      <div className='flex flex-col justify-end gap-4 tablet:col-start-2 tablet:gap-4 mobile:col-span-3 mobile:flex-row'>
        <LinkButton
          href={data.content.secondaryCta.url!!}
          className='tablet:w-fit'
        >
          {data.content.secondaryCta.label}
          <Icon value='miniArrowUpRight' width={20} height={20} />
        </LinkButton>
        <LinkButton href={data.content.cta.url!!} className='tablet:w-fit'>
          {data.content.cta.label}
          <Icon value='miniEnvelope' width={20} height={20} />
        </LinkButton>
      </div>
    </Section>
  );
};

export default AboutMe;
