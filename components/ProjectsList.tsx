import { fetchProjects } from '@/services/content/projects';
import React from 'react';
import ProjectCard from './ProjectCard';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { Icon } from './icons';
import { PreviewProject } from '@/models/blog/blog.models';

interface Props {
  data: PreviewProject[] | undefined;
  locale: string;
  dict: Dictionary;
}

const ProjectsList = ({ data, locale, dict }: Props) => {
  const renderFeaturedProjects = () =>
    data !== undefined ? (
      data.map((project, index) => (
        <ProjectCard
          key={project.id}
          path={`/${locale}/${project.path}`}
          project={project}
          locale={locale}
          featured={true}
          delay={0.5 + index * 0.1}
        />
      ))
    ) : (
      <li className='flex items-center col-span-4 gap-2 px-4 py-2 border rounded mobile:col-span-5 text-warning dark:text-warning border-warning bg-warning/25'>
        <Icon value='solidWarning' width={24} height={24} />
        {dict.latestArticles.notFound}
      </li>
    );

  return (
    <ul className='grid w-full grid-cols-4 mobile:grid tablet:grid-rows-1 mobile:grid-cols-5 tablet:col-span-4'>
      {renderFeaturedProjects()}
    </ul>
  );
};

export default ProjectsList;
