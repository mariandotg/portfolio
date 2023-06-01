'use client';
import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from '@/syntaxTheme';
import { MdArrowOutward } from 'react-icons/md';

interface Props {
  children: string;
}

const Markdown = ({ children }: Props) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className='font-medium text-title dark:text-dark-headlines text-light-headlines'
            {...props}
          />
        ),
        h2: ({ node, ...props }) => {
          const index = props.children[0]!.toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replaceAll(' ', '-');

          return (
            <h2
              className='italic font-medium scroll-mt-[82px] font-monospace dark:text-dark-headlines text-light-headlines'
              id={index}
              {...props}
            />
          );
        },
        a: ({ node, children, target, rel, ...props }) => (
          <a
            className='flex items-center group duration-[10ms] px-2 py-1 gap-x-1 rounded cursor-pointer w-fit bg-light-tertiary-pressed/10 dark:bg-light-tertiary-pressed/20 italic underline text-primary font-monospace text-secondary hover:dark:text-dark-primary-hover underline-offset-2 hover:text-light-primary-hover'
            target='_blank'
            rel='noreferrer'
            {...props}
          >
            {children}
            <MdArrowOutward className='fill-primary group-hover:dark:fill-dark-primary-hover group-hover:fill-light-primary-hover group-hover:-translate-y-[2px] group-hover:translate-x-[2px]' />
          </a>
        ),
        p: ({ node, ...props }) => (
          <p
            className='flex gap-x-2 dark:text-dark-text text-light-text'
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className='before:content-[""] before:w-1 italic before:bg-primary before:h-full relative before:absolute before:top-0 left-4 before:-translate-x-4'
            {...props}
          />
        ),
        img: ({ node, src, alt, width, height }) => (
          <picture className='relative flex flex-col w-full h-64 mb-6'>
            <Image
              src={src!}
              alt={alt!}
              fill={true}
              className='absolute object-cover mb-2 rounded'
            />
            <span className='absolute -bottom-6 text-secondary'>{alt}</span>
          </picture>
        ),
        ul: ({ node, ordered, ...props }) => (
          <ul className='ml-4 list-disc' {...props} />
        ),
        code: ({ node, children, style, ...props }) => (
          <SyntaxHighlighter
            language='tsx'
            style={dark}
            wrapLongLines={true}
            children={children[0]!.toString()}
            {...props}
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
