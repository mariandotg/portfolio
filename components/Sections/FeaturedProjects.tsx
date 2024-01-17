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
  featured: boolean;
}

const FeaturedProjects = ({ data, locale, dict, featured }: Props) => {
  const additionalLink: AdditionalLink = {
    href: `${locale}/projects`,
    label: dict.featuredProjects.additionalLink,
  };

  const renderFeaturedProjects = () =>
    data !== undefined ? (
      data.map((project, index) => (
        <ProjectCard
          key={project.id}
          path={featured ? `${locale}/${project.path}` : `/${project.path}`}
          project={project}
          locale={locale}
          featured={true}
          delay={0.5 + index * 0.1}
        />
      ))
    ) : (
      <li className='flex items-center col-span-4 gap-2 px-4 py-2 border rounded mobile:col-span-5 text-warning dark:text-warning border-warning bg-warning/25'>
        <Icon value='solidWarning' width={24} height={24} />
        {dict.latestArticles.notFound}
      </li>
    );

  return (
    <Section>
      <SectionTitle additionalLink={additionalLink}>
        {dict.featuredProjects.title}
      </SectionTitle>
      <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
        <ul className='grid w-full grid-cols-4 gap-4 mobile:grid tablet:grid-rows-1 mobile:grid-cols-5 tablet:col-span-4'>
          {renderFeaturedProjects()}
          {/* <Suspense fallback={<ProjectsListFallback />}>
            {/*@ts-ignore }
            <ProjectsList locale={locale} dict={dict} featured={true} />
          </Suspense> */}
        </ul>
      </div>
    </Section>
  );
};

export default FeaturedProjects;
