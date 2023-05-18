import React from 'react';

import Section from './Section';
import SectionTitle from './SectionTitle';
import SkillItem from './SkillItem';
import Icon from './Icon';
import { getContentfulData } from '@/services/contentful';
import { IPage } from '@/models/contentful/generated/contentful';
import { pageContentAdapter } from '@/adapters/pageContentAdapter';

const SkillsSection = async () => {
  const { skills } = await getContentfulData<IPage>({
    locale: 'en',
    type: 'page',
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  return (
    <Section>
      <SectionTitle emoji={skills?.emoji}>{skills?.title}</SectionTitle>
      <p className='col-span-3 text text-light-text dark:text-dark-text'>
        {skills?.content.skillsDescription.text}
      </p>
      <div className='relative flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-3 '>
        {skills?.content.skillCards.map((skillCard, index) => {
          return (
            <div
              key={skillCard.id}
              className={`flex flex-col border border-transparent rounded gap-y-2 ${
                index === skills?.content.skillCards.length - 1
                  ? 'mobile:col-span-2 tablet:col-span-1'
                  : 'mobile:col-span-1'
              }`}
            >
              <h3 className='flex items-center font-medium gap-x-2 dark:text-dark-headlines text-title text-light-headlines'>
                <Icon
                  value={skillCard.title.toLocaleLowerCase()}
                  className='duration-[0ms] dark:text-dark-headlines text-light-headlines'
                />
                {skillCard.title}
              </h3>
              <div className='flex flex-wrap gap-2'>
                {skillCard.skills.map((skill, index) => {
                  return <SkillItem key={index} skill={skill} illuminate />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default SkillsSection;
