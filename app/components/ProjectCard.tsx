'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MdArrowForward } from 'react-icons/md';

import { Project } from '@/models/domain/Project';
import { Tag } from '@/models/domain/Tag';

import SkillItem from './SkillItem';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  project: Project;
  className?: string;
}

const ProjectCard = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [restTags, setRestTags] = useState(0);
  const [numMaxTags, setNumMaxTags] = useState(0);
  const [displayedTags, setDisplayedTags] = useState<Tag[]>(props.project.tags);
  const pathname = usePathname();

  console.log('path', pathname);
  const truncateString = (string: string, maxLength: number) => {
    if (string.length >= maxLength) {
      return string.slice(0, maxLength - 3) + '...';
    }
    return string;
  };

  useEffect(() => {
    const container = containerRef.current!;
    const containerWidth = container.getBoundingClientRect().width;
    const tagsWidths = Array.from(container.children).map(
      (child) => child.getBoundingClientRect().width
    );
    let actualWidth = 24;
    let numMaxTags = 0;
    tagsWidths.forEach((tagRef) => {
      if (actualWidth + tagRef <= containerWidth) {
        actualWidth += tagRef;
        numMaxTags++;
      }
    });
    setNumMaxTags(numMaxTags);
  }, [props.project.tags, containerRef, setNumMaxTags]);

  useEffect(() => {
    const container = containerRef.current!;
    const containerWidth = container.getBoundingClientRect().width;
    const tagsWidths = Array.from(container.children).map(
      (child) => child.getBoundingClientRect().width
    );
    let actualWidth = 24;
    let numMaxTags = 0;
    tagsWidths.forEach((tagRef) => {
      if (actualWidth + tagRef <= containerWidth) {
        actualWidth += tagRef;
        numMaxTags++;
      }
    });
    setNumMaxTags(numMaxTags);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const containerWidth = entry.target.getBoundingClientRect().width;
          let actualWidth = 24;
          let numMaxTags = 0;
          tagsWidths.forEach((tagRef) => {
            if (actualWidth + tagRef <= containerWidth) {
              actualWidth += tagRef;
              numMaxTags++;
            }
          });
          setNumMaxTags(numMaxTags);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, setNumMaxTags]);

  useEffect(() => {
    setDisplayedTags(props.project.tags.slice(0, numMaxTags));
    setRestTags(props.project.tags.length - numMaxTags);
  }, [props.project.tags, numMaxTags]);

  return (
    <Link
      className={`${props.className} group tablet:grid mobile:col-span-2 tablet:grid-cols-3 tablet:col-span-3 mobile:gap-4`}
      href={`${pathname}/projects/${props.project.path}`}
    >
      <div
        className={`flex flex-col tablet:col-span-1 tablet:group-hover:border-light-primary-hover tablet:group-hover:dark:border-dark-primary-hover cursor-pointer justify-between border border-transparent gap-y-4 tablet:p-4 group rounded dark:text-dark-text text-light-text`}
      >
        <div className='flex flex-col gap-y-2'>
          <div className='relative w-full h-[135px] mobile:h-[100px] tablet:hidden'>
            <Image
              src={props.project.image}
              alt={`${props.project.name} image`}
              className='absolute flex object-cover w-full rounded tablet:hidden'
              fill={true}
            />
          </div>
          <div className='flex flex-col gap-y-1'>
            <h3 className='flex items-center font-medium whitespace-nowrap text-title group-hover:gap-x-2 gap-x-1 font-display dark:text-dark-headlines text-light-headlines'>
              {props.project.name}
              <MdArrowForward className='duration-[0ms] dark:text-dark-headlines h-5 w-5 text-light-headlines' />
            </h3>
            <p className='text'>
              {truncateString(props.project.description, 47)}
            </p>
          </div>
        </div>
        <div
          className='flex flex-row items-center w-full gap-2'
          ref={containerRef}
        >
          {displayedTags.map((tag, index) => (
            <SkillItem key={tag.id} skill={tag.name} />
          ))}
          {restTags !== 0 && (
            <span className='h-[24px] w-[24px] flex justify-center items-center rounded-[50px] bg-light-text dark:bg-dark-text text-dark-headlines dark:text-light-headlines font-medium text-[12px]'>
              +{restTags}
            </span>
          )}
        </div>
      </div>
      <div className='relative hidden rounded cursor-pointer tablet:border tablet:border-transparent tablet:group-hover:border-primary mobile:col-span-1 tablet:col-span-2 group mobile:overflow-hidden tablet:flex'>
        <Image
          src={props.project.image}
          alt={`${props.project.name} image`}
          className='absolute z-10 object-cover object-center aspect-square'
          fill={true}
        />
      </div>
    </Link>
  );
};

export default ProjectCard;
