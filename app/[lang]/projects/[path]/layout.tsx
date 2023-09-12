import PageLayout from '@/components/PageLayout';
import { fetchProjects } from '@/services/content/projects';
import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    path: string;
    lang: string;
  };
}

export async function generateStaticParams() {
  const products = await fetchProjects('en');
  const langs = [{ lang: 'en' }, { lang: 'es' }];

  return langs.flatMap(({ lang }) =>
    products!.map(({ path }) => ({
      path,
      lang,
    }))
  );
}

const ProjectLayout = async ({ children, params }: Props) => {
  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
        {children}
      </div>
    </PageLayout>
  );
};

export default ProjectLayout;
