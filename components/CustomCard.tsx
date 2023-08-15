'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { PreviewProject } from '@/models/blog/blog.models';
import { ProjectCardProps } from './ProjectCard';

interface Props {
  lang: string;
  children: ReactNode;
  iterableArray: PreviewProject[];
  fallback: ReactNode;
}

const CustomCard = async ({
  children,
  iterableArray,
  fallback,
  lang,
}: Props) => {
  const [projects, setProjects] = useState<PreviewProject[]>([]);
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
