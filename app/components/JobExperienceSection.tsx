import React from 'react';

import Section from './Section';
import SectionTitle from './SectionTitle';
import { getContentfulData } from '@/services/contentful';
import { IPage } from '@/models/contentful/generated/contentful';
import { pageContentAdapter } from '@/adapters/pageContentAdapter';

const JobExperienceSection = async () => {
  const { jobExperience } = await getContentfulData<IPage>({
    locale: 'en',
    type: 'page',
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  return (
    <Section>
      <SectionTitle emoji={jobExperience?.emoji}>
        {jobExperience?.title}
      </SectionTitle>
      <div className='flex flex-col gap-y-8 relative tablet:col-span-3 tablet:gap-0 border-l-[1px] tablet:border-none border-primary '>
        {jobExperience?.content.jobCards.map((jobCard) => {
          return (
            <div
              key={jobCard.id}
              id='this'
              className='relative flex flex-col pl-4 tablet:grid gap-y-2 tablet:grid-cols-3 tablet:pl-0 tablet:gap-8'
            >
              <div className='relative tablet:col-span-1'>
                <span
                  className={`text-secondary tablet:text tablet:justify-end flex font-light text-light-text dark:text-dark-text tablet:after:top-0 tablet:after:-right-[16px] tablet:after:content-[""] tablet:after:h-full tablet:after:w-[1px] tablet:after:absolute tablet:after:bg-primary `}
                >
                  {jobCard.period}
                </span>
              </div>
              <div className='flex tablet:pb-8 tablet:border-none tablet:relative flex-col gap-y-2 tablet:col-span-2 before:content-[""] before:rounded before:w-[7px] before:h-[7px] before:bg-primary before:absolute before:top-1 tablet:before:top-2 before:right-auto tablet:before:-left-5 before:-left-1'>
                <div>
                  <span className='italic font-medium underline underline-offset-2 text font-monospace text-light-text dark:text-dark-text'>
                    {jobCard.company}
                  </span>
                  <h3 className='flex font-medium text-title gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
                    {jobCard.position}
                  </h3>
                </div>
                <p className='text text-light-text dark:text-dark-text'>
                  {jobCard.responsabilities}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default JobExperienceSection;
