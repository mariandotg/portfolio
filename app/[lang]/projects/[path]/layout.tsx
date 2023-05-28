import React from 'react';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projectFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/en/api/projects/${params.path}`,
    { cache: 'no-cache' }
  );

  const projectResponse: ProjectData = await projectFetch.json();

  return metadataAdapter(projectResponse.seo);
}

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) => {
  return children;
};

export default ProjectLayout;
