import { fetchProjects } from '@/services/blog';
import { data } from 'autoprefixer';
import React from 'react';
import Section from '../Section';
import SectionTitle, { AdditionalLink } from '../SectionTitle';
import { ProjectsContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import ProjectCard from '../ProjectCard';
import { PreviewProject } from '@/models/blog/blog.models';

interface Props {
  data: FormattedSection<ProjectsContent>;
  featuredProjects: PreviewProject[] | undefined;
  locale: string;
}

const FeaturedProjects = ({ data, featuredProjects, locale }: Props) => {
  const renderFeaturedProjects = () =>
    featuredProjects!.map((project, index) => (
      <ProjectCard
        key={project.id}
        project={project}
        locale={locale}
        featured={true}
        delay={0.5 + index * 0.1}
      />
    ));

  const additionalLink: AdditionalLink = {
    href: `${locale}/projects`,
    label: 'See all my projects',
  };

  return (
    <Section>
      <SectionTitle emoji={data.emoji} additionalLink={additionalLink}>
        {data.title}
      </SectionTitle>
      <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
        <div className='grid w-full grid-cols-4 gap-y-8 mobile:grid tablet:grid-rows-1 mobile:grid-cols-5 mobile:gap-4 tablet:grid-cols-6 tablet:col-span-4 tablet:gap-4'>
          {renderFeaturedProjects()}
        </div>
      </div>
    </Section>
  );
};

export default FeaturedProjects;
