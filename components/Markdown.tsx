'use client';
import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from '@/syntaxTheme';

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
              className='italic font-medium scroll-mt-[73px] font-monospace dark:text-dark-headlines text-light-headlines'
              id={index}
              {...props}
            />
          );
        },
        img: ({ node, src, alt, width, height }) => (
          <>
            <div className='relative h-64 mb-2'>
              <Image
                src={src!}
                alt={alt!}
                fill={true}
                className='absolute object-cover rounded'
              />
            </div>
            <p className='text-secondary'>{alt}</p>
          </>
        ),
        ul: ({ node, ...props }) => (
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
