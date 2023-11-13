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
import { Icon } from '@/components/icons';

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
      <li className='flex items-center col-span-4 gap-2 px-4 py-2 border rounded mobile:col-span-5 text-warning dark:text-warning border-warning bg-warning/25'>
        <Icon value='miniReload' width={20} height={20} />
        {dict.projects.notFound}
      </li>
    );
  return (
    <PageLayout className='py-32'>
      <Section>
        <div className='grid grid-cols-4 gap-y-8 mobile:grid-cols-5 mobile:gap-4 tablet:col-span-4'>
          <div className='flex flex-col col-span-4 gap-4 mobile:col-span-5 min-h-[96px]'>
            <h1 className='italic font-semibold text-article text-light-headlines dark:text-dark-headlines font-monospace'>
              {dict.projects.title}
            </h1>
            <p className='font-display text text-light-text dark:text-dark-text'>
              {dict.projects.description}
            </p>
          </div>
          <ul className='grid grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-y-4'>
            {renderProjectCards()}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
