import { PreviewProject } from '@/models/blog/blog.models';
import Link from 'next/link';
import React from 'react';
import Chip from './Chip';
import useDate from '@/hooks/useDate';
import GlowableCard from './GlowableCard';
import Card from './Card';

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
    <>
      <div className='col-span-1 py-2 text-light-secondary/60 dark:text-dark-secondary/60'>
        <span className=' text-secondary'>{year}</span>
      </div>
      <Link
        href={props.path}
        className='flex flex-col col-span-3 gap-1 rounded-sm mobile:col-span-4 text-light-secondary/60 dark:text-dark-secondary/60'
      >
        <Card as='div'>
          <h4 className='text-article'>{props.project.title}</h4>
          <p className='text-secondary'>{props.project.description}</p>
          <div className='flex gap-2 mt-1'>
            {props.project.tags.map((tag, index) => (
              <Chip key={tag.id}>{tag.name}</Chip>
            ))}
          </div>
        </Card>
      </Link>
    </>
  );
};

export default ProjectCard;
