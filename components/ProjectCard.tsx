import { PreviewProject } from '@/models/blog/blog.models';
import Link from 'next/link';
import React from 'react';
import Chip from './Chip';
import useDate from '@/hooks/useDate';
import Card from './Card';

const previews = {
  small: 'mobile:col-span-1',
  large: 'mobile:grid-cols-5 mobile:col-span-5 gap-4',
};

export interface Props {
  project: PreviewProject;
  className?: string;
  locale: string;
  featured: boolean;
  delay?: number;
  path: string;
}

const ProjectCard = (props: Props) => {
  const { year } = useDate(new Date(props.project.publishedAt));

  return (
    <li
      key={props.project.id}
      className={`grid grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-4 ${previews['small']}`}
    >
      {/* {displayDate && ( */}
      <p className='col-span-4 mobile:col-span-1 text-light-text dark:text-dark-text text-secondary'>
        {year}
      </p>
      {/* )} */}
      <Link
        href={props.path}
        className='flex flex-col col-span-4 gap-1 rounded-sm text-light-secondary/60 dark:text-dark-secondary/60'
      >
        <Card as='div'>
          <h4 className='font-medium break-words transition-all duration-500 text text-light-headlines dark:text-dark-headlines font-display hyphens-auto'>
            {props.project.title}
          </h4>
          <p className='text-secondary'>{props.project.description}</p>
          <div className='flex gap-2 mt-1'>
            {props.project.tags.map((tag, index) => (
              <Chip key={tag.id}>{tag.name}</Chip>
            ))}
          </div>
        </Card>
      </Link>
    </li>
  );
};

export default ProjectCard;
