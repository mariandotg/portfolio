import PageLayout from '@/components/PageLayout';
import { PageSeo } from '@/models/PageSeo';
import { Project } from '@/models/domain/Project';
import Image from 'next/image';
import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    path: string;
    lang: string;
  };
}

interface ProjectData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Project;
}

const ProjectLayout = async ({ children, params }: Props) => {
  const projectFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects/${params.path}`,
    { cache: 'no-cache' }
  );

  const projectResponse: ProjectData = await projectFetch.json();

  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
        <div className='flex flex-col col-span-3 gap-y-2'>
          <div className='relative h-64 tablet:col-span-3'>
            <Image
              src={projectResponse.properties.image}
              alt={projectResponse.properties.imageAlt}
              className='absolute object-cover rounded'
              fill={true}
              priority
              quality={90}
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3gro4IHDZy0jAoA9QM6yzHo/PoAAAAASUVORK5CYII='
            />
          </div>
        </div>
        {children}
      </div>
    </PageLayout>
  );
};

export default ProjectLayout;
