import { fetchProjects } from '@/services/content/projects';
import React from 'react';
import ProjectCard from './ProjectCard';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { Icon } from './icons';

interface Props {
  locale: string;
  dict: Dictionary;
  featured?: boolean;
}

const ProjectsList = async ({ locale, dict, featured = false }: Props) => {
  const projects = await fetchProjects(locale);
  const featuredProjects = featured ? projects?.slice(0, 4) : projects;

  const renderFeaturedProjects = () =>
    featuredProjects !== undefined ? (
      featuredProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          path={featured ? `${locale}/${project.path}` : `/${project.path}`}
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

  return renderFeaturedProjects();
};

export default ProjectsList;
