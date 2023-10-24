import React from 'react';
import Section from '../Section';
import SectionTitle from '../SectionTitle';
import { JobsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';

interface Props {
  data: FormattedSection<JobsContent>;
}

const JobExperience = ({ data }: Props) => {
  const renderJobCards = () =>
    data.content.jobCards.map((jobCard) => (
      <li
        className='grid w-full grid-cols-4 col-span-4 mobile:col-span-5 tablet:col-span-6 gap-y-8 mobile:grid tablet:grid-rows-1 mobile:grid-cols-5 mobile:gap-4 tablet:gap-4 tablet:grid-cols-6'
        key={jobCard.id}
      >
        <div className='hidden col-span-1 py-2 text-light-secondary/60 tablet:flex tablet:col-span-1 tablet:justify-end tablet:mr-[2px] dark:text-dark-secondary/60'>
          <span>{jobCard.period}</span>
        </div>
        <div className='grid w-full p-2 rounded tablet:relative tablet:mb-4 gap-y-8 mobile:gap-4 tablet:col-span-5 tablet:gap-1'>
          <p className='mb-1 leading-none text-secondary text-light-secondary/60 dark:text-dark-secondary/60 tablet:hidden'>
            {jobCard.period}
          </p>
          <h3 className='flex font-medium text gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
            {jobCard.position} - {jobCard.company}
          </h3>
          <p className='text-secondary text-light-secondary/60 dark:text-dark-secondary/60'>
            {jobCard.responsabilities}
          </p>
        </div>
      </li>
    ));

  return (
    <Section>
      <SectionTitle emoji={data.emoji}>{data.title}</SectionTitle>
      <ol className='relative grid w-full grid-cols-4 border-l tablet:border-none border-primary gap-y-8 mobile:grid tablet:grid-rows-1 mobile:grid-cols-5 mobile:gap-4 tablet:grid-cols-6 tablet:col-span-4 tablet:gap-0'>
        {renderJobCards()}
      </ol>
    </Section>
  );
};

export default JobExperience;
