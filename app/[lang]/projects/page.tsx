import React from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import Section from '@/components/Sections/Section/Section';
import { fetchProjects } from '@/services/content/projects';
import { fetchPageByPath } from '@/services/content/pages';
import { Meta } from '@/models/blog/blog.models';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { getDictionary } from '../dictionaries';

interface Props {
  params: {
    path: string;
    lang: string;
  };
  searchParams: {
    tags: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<{ seo: Meta }>('projects', params.lang);
  return metadataAdapter(data!.seo);
}

const ProjectsPage = async ({ searchParams, params }: Props) => {
  const projects = await fetchProjects(params.lang);
  const dict = await getDictionary(params.lang);

  const renderProjectCards = () =>
    projects !== undefined ? (
      projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          path={`${project.path}`}
          locale={params.lang}
          featured={false}
          project={project}
          delay={0.5 + index * 0.1}
        />
      ))
    ) : (
      <p className='col-span-1 dark:text-dark-text text-light-text'>
        {dict.projects.notFound}
      </p>
    );
  return (
    <PageLayout className='py-32'>
      <Section>
        <div className='grid grid-cols-4 gap-y-8 mobile:grid-cols-5 mobile:gap-4 tablet:col-span-4 tablet:gap-4'>
          <h1 className='col-span-4 mobile:col-span-5 text-title text-light-headlines dark:text-dark-headlines'>
            Welcome to my projects.
          </h1>
          <p className='col-span-4 mobile:col-span-5 font-display text text-light-text dark:text-dark-text'>
            This is where I share the case studies of both my personal and
            commercial projects.
          </p>
          {renderProjectCards()}
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
