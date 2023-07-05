'use client';
import React, { ReactNode, useState } from 'react';
import { Project } from '@/models/domain/Project';
import { ProjectCardProps } from './ProjectCard';
import { useSearchParams } from 'next/navigation';

interface Props {
  lang: string;
  children: ReactNode;
  iterableArray: Project[];
  fallback: ReactNode;
}

const CustomCard = ({ children, iterableArray, fallback }: Props) => {
  const validChildren = React.Children.toArray(children).filter(
    Boolean
  ) as React.ReactElement<ProjectCardProps>[];

  return (
    <>
      {iterableArray.length !== 0
        ? iterableArray.map((project) =>
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
