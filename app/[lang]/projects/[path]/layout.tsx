import PageLayout from '@/components/PageLayout';
import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    path: string;
    lang: string;
  };
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
