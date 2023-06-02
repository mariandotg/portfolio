import Image from 'next/image';
import React from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/models/domain/Project';
import SectionTitle from '@/components/SectionTitle';
import Section from '@/components/Section';

interface Props {
  params: {
    path: string;
    lang: string;
  };
}
const ProjectsPage = async ({ params }: Props) => {
  const projectsFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects`,
    { cache: 'no-cache' }
  );

  const projectsResponse: { projects: Project[] } = await projectsFetch.json();

  return (
    <PageLayout>
      <Section>
        <SectionTitle emoji='pin'>Projects</SectionTitle>
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-3 tablet:grid-cols-3 tablet:grid-rows-3 tablet:gap-4'>
          {projectsResponse.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              className={
                index === 0 ? 'mobile:col-span-2' : 'mobile:col-span-1'
              }
              locale={'/en'}
            />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
