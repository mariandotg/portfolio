import React from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';
import { PageSeo } from '@/models/PageSeo';
import { Project } from '@/models/domain/Project';

interface Props {
  params: {
    path: string;
  };
}

interface ProjectData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Project;
}

const ProjectPage = async ({ params }: Props) => {
  const projectFetch = await fetch(
    `${process.env.BASE_FETCH_URL}/en/api/articles/${params.path}`,
    { cache: 'no-cache' }
  );

  const projectResponse: ProjectData = await projectFetch.json();
  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text'>
        <div className='flex flex-col gap-y-2'>
          <div className='relative h-64 mt-20'>
            <Image
              src={projectResponse.properties.image}
              alt='page header'
              className='absolute object-cover rounded'
              fill={true}
              priority
              quality={90}
            />
          </div>
          <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
                {projectResponse.properties.name}
              </h1>
              <p>{projectResponse.properties.description}</p>
            </div>
            <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
              {projectResponse.properties.tags.map((tag, index) => (
                <li>
                  <SkillItem key={tag.id} skill={tag.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='flex flex-col gap-y-4'>
          <Markdown>{projectResponse.content.parent}</Markdown>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectPage;
