import React, { Suspense } from 'react';
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
import ProjectsList from '@/components/ProjectsList';
import ProjectsListFallback from '@/components/ProjectsListFallback';

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
  const dict = await getDictionary(params.lang);

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
            <Suspense fallback={<ProjectsListFallback />}>
              {/*@ts-ignore */}
              <ProjectsList locale={params.lang} dict={dict} />
            </Suspense>
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
