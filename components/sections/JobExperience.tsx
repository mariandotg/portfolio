import React from 'react';
import Section from '../Section';
import SectionTitle from '../SectionTitle';
import { JobsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import Chip from '../Chip';

interface Props {
  data: FormattedSection<JobsContent>;
}

const JobExperience = ({ data }: Props) => {
  const renderJobCards = () =>
    data.content.jobCards.map((jobCard) => (
      <li
        className='grid w-full grid-cols-5 col-span-5 tablet:grid-cols-6 mobile:col-span-5 tablet:col-span-6 gap-y-8 mobile:grid-rows-1 mobile:gap-4'
        key={jobCard.id}
      >
        <div className='hidden col-span-1 py-2 text-light-secondary/60 mobile:flex mobile:col-span-1 mobile:justify-end mobile:mr-[2px] dark:text-dark-secondary/60 mobile:pr-2'>
          <span className='relative mobile:before:content-[""] mobile:before:h-2 mobile:before:w-2 mobile:before:bg-primary mobile:before:absolute mobile:before:-right-[22px] mobile:before:top-[9px] mobile:before:rounded-full h-min'>
            {jobCard.period}
          </span>
        </div>
        <div className='grid w-full col-span-5 mobile:col-span-4 tablet:col-span-5 p-2 pl-4 mobile:relative gap-y-1 mobile:gap-y-2 mobile:before:content-[""] mobile:before:h-full mobile:before:w-[1px] mobile:before:bg-primary mobile:before:absolute mobile:before:-left-2'>
          <p className='mb-1 leading-none text-secondary text-light-secondary/60 dark:text-dark-secondary/60 mobile:hidden relative before:content-[""] before:h-2 before:w-2 before:bg-primary before:absolute before:-left-[21px] before:top-[3px] before:rounded-full h-min'>
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
          <p className='text-secondary text-light-secondary/60 dark:text-dark-secondary/60'>
            {jobCard.responsabilities}
          </p>

          {
            //future
            /* <ul className='relative flex flex-wrap gap-2'>
            {['react', 'typescript', 'kotlin', 'tailwindcss'].map(
              (skill, index) => (
                <Chip key={index}>{skill}</Chip>
              )
            )}
          </ul>
          <ol className='mb-4 list-disc list-inside text-light-secondary/60 dark:text-dark-secondary/60'>
            <li className='marker:mr-0 text-secondary'>trabajar hasta 18hs</li>
            <li className='marker:mr-0 text-secondary'>
              testear funciones unitarias
            </li>
            <li className='marker:mr-0 text-secondary'>
              crear componentes de react que optimicen al 50% la eficiencia de
              la web
            </li>
          </ol> */
          }
        </div>
      </li>
    ));

  return (
    <Section>
      <SectionTitle emoji={data.emoji}>{data.title}</SectionTitle>
      <ol className='relative grid w-full grid-cols-5 border-l mobile:border-none border-primary gap-y-8 mobile:grid mobile:grid-rows-1 mobile:gap-0 tablet:grid-cols-6 mobile:col-span-4 tablet:gap-0'>
        {renderJobCards()}
      </ol>
    </Section>
  );
};

export default JobExperience;
