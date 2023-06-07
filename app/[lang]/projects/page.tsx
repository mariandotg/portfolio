import React from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/models/domain/Project';
import Section from '@/components/Section';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

interface ArticleData {
  markdown: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  metadata: Article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/projects`,
    { cache: 'no-cache' }
  );

  const articleResponse: ArticleData = await articleFetch.json();

  return metadataAdapter(articleResponse.seo);
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
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-3 tablet:grid-cols-3 tablet:grid-rows-3 tablet:gap-4'>
          {projectsResponse.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              className='mobile:col-span-1'
              locale={params.lang}
              featured={false}
            />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
