import React from 'react';
import Chip from '../Chip';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { SkillsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import GlowableCard from '../GlowableCard';
import { Dictionary } from '@/app/[lang]/dictionaries';
import Icon from '../icons/Icon';

interface Props {
  data: FormattedSection<SkillsContent>;
  dict: Dictionary;
}

const Skills = ({ data, dict }: Props) => {
  const renderSkillCards = () =>
    data.content.skillCards.map((skillCard, index) => {
      return (
        <GlowableCard>
          <span className='z-10 p-2 border rounded-full w-fit border-light-subtle-edges dark:border-dark-subtle-edges bg-light dark:bg-dark dark:text-dark-headlines text-light-headlines'>
            <Icon value={skillCard.icon} width={16} height={16} />
          </span>
          <h3 className='font-medium dark:text-dark-headlines text text-light-headlines'>
            {skillCard.title}
          </h3>
          <ul className='relative flex flex-wrap gap-2'>
            {skillCard.skills.map((skill, index) => (
              <Chip key={index}>{skill}</Chip>
            ))}
          </ul>
        </GlowableCard>
      );
    });

  const additionalLink: AdditionalLink = {
    href: `https://www.linkedin.com/in/marianoguillaume/`,
    label: dict.skills.additionalLink,
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
        <div className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 cards'>
          {renderSkillCards()}
        </div>
      </div>
    </Section>
  );
};

export default Skills;
