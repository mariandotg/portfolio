import React from 'react';
import Section from './Section/Section';
import SectionTitle from './Section/SectionTitle';
import { JobsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import Chip from '../Chip';

interface Props {
  data: FormattedSection<JobsContent>;
}

const JobExperience = ({ data }: Props) => {
  const renderJobCards = () =>
    data.content.jobCards.map((jobCard, index) => (
      <li className='mobile:pl-4' key={jobCard.id}>
        <div
          className={`grid w-full col-span-5 pl-4 relative gap-y-1 mobile:gap-y-2 before:content-[""] before:h-full before:w-[1px] before:absolute before:left-0 mobile:before:-left-2 before:bg-primary ${
            index === 0 &&
            'before:bg-gradient-to-t before:from-primary dark:before:to-dark before:to-light before:from-85%'
          } ${
            index === data.content.jobCards.length - 1 &&
            'before:bg-gradient-to-b before:from-primary dark:before:to-dark before:to-light before:to-85%'
          }`}
        >
          <p className='mb-1 leading-none text-light-secondary/60 dark:text-dark-text relative before:content-[""] before:h-[9px] before:w-[9px] before:bg-primary before:shadow-md before:absolute before:-left-[20px] before:top-[3px] before:rounded-full h-min text-secondary mobile:m-0 mobile:before:-left-[28px]'>
            {jobCard.period}
          </p>
          <div>
            <h3 className='flex font-medium text gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
              {jobCard.position} - {jobCard.company}
            </h3>
          </div>

          <ul className='relative flex flex-wrap gap-2'>
            {jobCard.tags.map((skill, index) => (
              <Chip key={index}>{skill}</Chip>
            ))}
          </ul>
          <ol className='flex flex-col mb-8 list-disc list-inside text-light-secondary/60 dark:text-dark-text gap-y-1'>
            {jobCard.responsabilities.map((responsability) => (
              <li className='marker:mr-0 text-secondary'>{responsability}</li>
            ))}
          </ol>
        </div>
      </li>
    ));

  return (
    <Section>
      <SectionTitle emoji={data.emoji}>{data.title}</SectionTitle>
      <ol className='relative w-full mobile:col-span-4 tablet:gap-0'>
        {renderJobCards()}
      </ol>
    </Section>
  );
};

export default JobExperience;
