'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { PreviewProject } from '@/models/blog/blog.models';
import { Tag } from '@/models/domain/Tag';
import Link from 'next/link';
import Chip from './Chip';

export interface ProjectCardProps {
  project?: PreviewProject;
  className?: string;
  locale: string;
  featured: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  if (!props.project)
    return <div className='bg-tertiary animate-pulse'>test placeholder</div>;

  const containerRef = useRef<HTMLUListElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [restTags, setRestTags] = useState(0);
  const [numMaxTags, setNumMaxTags] = useState(0);
  const [displayedTags, setDisplayedTags] = useState<Tag[]>(props.project.tags);

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
    setDisplayedTags(props.project!.tags.slice(0, numMaxTags));
    setRestTags(props.project!.tags.length - numMaxTags);
  }, [props.project.tags, numMaxTags]);

  return (
    <Link
      className={`${props.className} relative group border border-transparent p-4 rounded dark:hover:border-light-text/30 hover:border-dark-text/30 bg-dark-headlines/30 dark:bg-light-headlines/50 mobile:col-span-1 overflow-hidden mobile:gap-4 tablet:col-span-1`}
      href={`projects/${props.project.path}`}
      onMouseEnter={() => {
        videoRef.current!.currentTime = 0;
        videoRef.current!.play();
      }}
      onMouseLeave={() => {
        videoRef.current!.pause();
        videoRef.current!.load();
      }}
    >
      <div className='z-10 flex flex-col justify-end w-full h-full cursor-pointer group dark:text-dark-text text-light-text'>
        <div className='flex flex-col gap-y-2'>
          <div className='relative rounded-sm overflow-hidden w-full  h-[135px] tablet:h-[135px]'>
            <video
              ref={videoRef}
              className='flex object-cover w-full h-full'
              poster={props.project.image.url}
              height={135}
              width={344}
              loop
              muted
            >
              <source
                src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                type='video/mp4'
              />
            </video>
          </div>
          <div className='flex flex-col gap-y-1'>
            <span className='flex items-center font-medium whitespace-nowrap text group-hover:gap-x-2 gap-x-1 font-display text-light-headlines dark:text-dark-headlines group-hover:text-primary'>
              {props.project.title}
              <MdArrowForward className='duration-[0ms] text-light-headlines dark:text-dark-headlines h-4 w-4 group-hover:text-primary' />
            </span>
          </div>
          <ul
            className='flex flex-row items-center w-full gap-2'
            ref={containerRef}
          >
            {displayedTags.map((tag, index) => (
              <Chip key={tag.id}>{tag.name}</Chip>
            ))}
            {restTags !== 0 && (
              <span className='h-[24px] w-[24px] flex justify-center items-center rounded-[50px] bg-light-text dark:bg-dark-text text-dark-headlines dark:text-light-headlines font-medium text-[12px]'>
                +{restTags}
              </span>
            )}
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
