'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Project } from '@/models/domain/Project';
import { ProjectCardProps } from './ProjectCard';

interface Props {
  lang: string;
  children: ReactNode;
  iterableArray: Project[];
  fallback: ReactNode;
}

const CustomCard = async ({
  children,
  iterableArray,
  fallback,
  lang,
}: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const validChildren = React.Children.toArray(children).filter(
    Boolean
  ) as React.ReactElement<ProjectCardProps>[];

  useEffect(() => {
    setProjects(iterableArray);
  }, [iterableArray]);

  return (
    <>
      {projects.length !== 0
        ? projects.map((project) =>
            React.cloneElement(validChildren[0], {
              key: project.id,
              project,
            })
          )
        : fallback}
    </>
  );
};

export default CustomCard;
