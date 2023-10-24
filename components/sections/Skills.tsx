import React from 'react';
import Chip from '../Chip';
import Icon from '../Icon';
import Section from '../Section';
import SectionTitle, { AdditionalLink } from '../SectionTitle';
import { SkillsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';

interface Props {
  data: FormattedSection<SkillsContent>;
}

const Skills = ({ data }: Props) => {
  const renderSkillCards = () =>
    data.content.skillCards.map((skillCard, index) => {
      return (
        <div
          key={skillCard.id}
          className='flex flex-col p-4 rounded gap-y-2 mobile:col-span-1 bg-dark-headlines/30 dark:bg-light-headlines/50 hover:bg-light-secondary/5 dark:hover:bg-dark-secondary/5'
        >
          <span className='p-2 border rounded-full w-fit dark:border-light-text/30 border-dark-text/30 bg-light dark:bg-dark'>
            <Icon
              value={skillCard.title.toLocaleLowerCase()}
              className='duration-[0ms] dark:text-dark-headlines text-light-headlines'
            />
          </span>
          <h3 className='font-medium dark:text-dark-headlines text text-light-headlines'>
            {skillCard.title}
          </h3>
          <ul className='flex flex-wrap gap-2'>
            {skillCard.skills.map((skill, index) => (
              <Chip key={index}>{skill}</Chip>
            ))}
          </ul>
        </div>
      );
    });

  const additionalLink: AdditionalLink = {
    href: `https://www.linkedin.com/in/marianoguillaume/`,
    label: 'See my certificates on LinkedIn',
  };

  return (
    <Section>
      <SectionTitle emoji={data.emoji} additionalLink={additionalLink}>
        {data.title}
      </SectionTitle>
      <p className='col-span-4 text text-light-text dark:text-dark-text'>
        {data.content.skillsDescription.text}
      </p>
      <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
        <div className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-4 '>
          {renderSkillCards()}
        </div>
      </div>
    </Section>
  );
};

export default Skills;
