import React, { Suspense } from 'react';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { ProjectsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import ProjectCard from '../ProjectCard';
import { PreviewProject } from '@/models/blog/blog.models';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { Icon } from '../icons';
import { fetchProjects } from '@/services/content/projects';
import ProjectsList from '../ProjectsList';
import ProjectsListFallback from '../ProjectsListFallback';

interface Props {
  data: PreviewProject[] | undefined;
  locale: string;
  dict: Dictionary;
}

const FeaturedProjects = ({ data, locale, dict }: Props) => {
  const additionalLink: AdditionalLink = {
    href: `${locale}/projects`,
    label: dict.featuredProjects.additionalLink,
  };

  return (
    <Section>
      <SectionTitle additionalLink={additionalLink}>
        {dict.featuredProjects.title}
      </SectionTitle>
      <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
        <ProjectsList data={data} dict={dict} locale={locale} />
        {/* <Suspense fallback={<ProjectsListFallback />}>
            {/*@ts-ignore }
            <ProjectsList locale={locale} dict={dict} featured={true} />
          </Suspense> */}
      </div>
    </Section>
  );
};

export default FeaturedProjects;
