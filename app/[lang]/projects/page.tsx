import React, { Suspense } from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import Section from '@/components/Section';
import FilterByTag from '@/components/FilterByTag';
import CustomCard from '@/components/CustomCard';
import { fetchProjects } from '@/services/content/projects';
import { fetchPageByPath } from '@/services/content/pages';
import { Meta } from '@/models/blog/blog.models';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';

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

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-3 mobile:gap-4 tablet:col-span-4 tablet:gap-4'>
          {/* @ts-expect-error Async Server Component */}
          <CustomCard
            lang={params.lang}
            iterableArray={projects}
            fallback={
              <p className='col-span-1 dark:text-dark-text text-light-text'>
                No se encontró proyectos que cumplan con el filtro ingresado
              </p>
            }
          >
            <ProjectCard
              className='mobile:col-span-1'
              locale={params.lang}
              featured={false}
            />
          </CustomCard>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
