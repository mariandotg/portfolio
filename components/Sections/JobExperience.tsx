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
      <li
        className='grid w-full grid-cols-5 col-span-5 mobile:col-span-5 tablet:col-span-6 gap-y-8 mobile:grid-rows-1 mobile:gap-4 '
        key={jobCard.id}
      >
        <div className='hidden col-span-1 py-2 text-light-secondary/60 mobile:flex mobile:col-span-1 mobile:justify-end mobile:mr-[2px] dark:text-dark-secondary/60 mobile:pr-2 '>
          <span
            className={`relative mobile:before:content-[""] mobile:before:z-[900] mobile:before:h-[9px] mobile:before:w-[9px]  mobile:before:absolute mobile:before:-right-[23px] mobile:before:top-[9px] mobile:before:rounded-full h-min text-secondary mobile:before:bg-primary mobile:before:shadow-md`}
          >
            {jobCard.period}
          </span>
        </div>
        <div
          className={`grid w-full col-span-5 mobile:col-span-4 p-2 pl-4 relative gap-y-1 mobile:gap-y-2 before:content-[""] before:h-full before:w-[1px] before:absolute before:left-0 mobile:before:-left-2 before:bg-primary ${
            index === 0 &&
            'before:bg-gradient-to-t before:from-primary dark:before:to-dark before:to-light before:from-85%'
          } ${
            index === data.content.jobCards.length - 1 &&
            'before:bg-gradient-to-b before:from-primary dark:before:to-dark before:to-light before:to-85%'
          }`}
        >
          <p className='mb-1 leading-none text-light-secondary/60 dark:text-dark-secondary/60 mobile:hidden relative before:content-[""] before:h-[9px] before:w-[9px] before:bg-primary before:shadow-md before:absolute before:-left-[20px] before:top-[3px] before:rounded-full h-min text-secondary'>
            {jobCard.period}
          </p>
          <div>
            <h3 className='flex font-medium text gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
              {jobCard.position}
            </h3>
            <h4 className='flex font-medium text gap-x-4 dark:text-dark-secondary/60 font-display text-light-secondary/60'>
              {jobCard.company}
            </h4>
          </div>

          <ul className='relative flex flex-wrap gap-2'>
            {jobCard.tags.map((skill, index) => (
              <Chip key={index}>{skill}</Chip>
            ))}
          </ul>
          <ol className='flex flex-col mb-8 list-disc list-inside mobile:mb-4 text-light-secondary/60 dark:text-dark-secondary/60 gap-y-1'>
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
      <ol className='relative grid w-full grid-cols-4 gap-0 mobile:grid mobile:grid-rows-1 mobile:grid-cols-5 mobile:col-span-4 tablet:gap-0'>
        {renderJobCards()}
      </ol>
    </Section>
  );
};

export default JobExperience;
