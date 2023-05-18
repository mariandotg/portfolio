import React from 'react';

import Section from './Section';
import ProjectCard from './ProjectCard';
import SectionTitle from './SectionTitle';
import { getContentfulData } from '@/services/contentful';
import { IPage } from '@/models/contentful/generated/contentful';
import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { queryNotionDatabase } from '@/services/notion';
import { projectsAdapter } from '@/adapters/projectsAdapter';

const FeaturedProjectsSection = async () => {
  const { featuredProjects } = await getContentfulData<IPage>({
    locale: 'en',
    type: 'page',
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const projectsFilter: CompoundFilterObj = {
    and: [
      {
        property: 'Stage',
        select: {
          equals: 'Published',
        },
      },
      {
        property: 'Database',
        select: {
          equals: 'Projects Database',
        },
      },
    ],
  };

  const projectsResponse = await queryNotionDatabase({
    databaseId,
    filter: projectsFilter,
  });

  featuredProjects.content.projects = projectsAdapter(projectsResponse);

  return (
    <Section>
      <SectionTitle
        button={{
          label: 'See all my projects',
          variant: 'secondary',
        }}
        emoji={featuredProjects?.emoji}
      >
        {featuredProjects?.title}
      </SectionTitle>
      <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-3 tablet:grid-cols-3 tablet:grid-rows-3 tablet:gap-4'>
        {featuredProjects?.content.projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            className={index === 0 ? 'mobile:col-span-2' : 'mobile:col-span-1'}
          />
        ))}
      </div>
    </Section>
  );
};

export default FeaturedProjectsSection;
