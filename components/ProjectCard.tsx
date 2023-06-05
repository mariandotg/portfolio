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
  locale: string;
}

const ProjectCard = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [restTags, setRestTags] = useState(0);
  const [numMaxTags, setNumMaxTags] = useState(0);
  const [displayedTags, setDisplayedTags] = useState<Tag[]>(props.project.tags);
  const pathname = usePathname();

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
      className={`${props.className} relative group border rounded border-transparent mobile:col-span-1 overflow-hidden mobile:gap-4 tablet:hover:border-light-primary-hover tablet:hover:dark:border-dark-primary-hover`}
      href={`${props.locale}/projects/${props.project.path}`}
      locale={props.locale}
    >
      <div
        className={`flex flex-col z-10 w-full h-full justify-end tablet:p-4 tablet:translate-y-[40px] tablet:group-hover:translate-y-0 cursor-pointer gap-y-4 group dark:text-dark-text text-light-text`}
      >
        <div className='flex flex-col gap-y-2'>
          <div className='flex flex-col gap-y-1'>
            <h3 className='flex items-center font-medium whitespace-nowrap text-title group-hover:gap-x-2 gap-x-1 font-display dark:text-dark-headlines text-light-headlines'>
              {props.project.name}
              <MdArrowForward className='duration-[0ms] dark:text-dark-headlines h-5 w-5 text-light-headlines' />
            </h3>
            <p className='text tablet:hidden dark:text-dark-text text-light-text'>
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
      <div className='absolute top-0 w-full h-full rounded opacity-0 -z-10 tablet:group-hover:opacity-100 bg-light/60 dark:bg-dark/70'></div>
      <Image
        src={props.project.image}
        alt={`${props.project.name} image`}
        className='absolute flex object-cover w-full rounded -z-20'
        fill={true}
      />
    </Link>
  );
};

export default ProjectCard;
