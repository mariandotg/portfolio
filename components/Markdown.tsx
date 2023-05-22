import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

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
        h2: ({ node, ...props }) => (
          <h2
            className='italic font-medium font-monospace dark:text-dark-headlines text-light-headlines'
            {...props}
          />
        ),
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
        pre: ({ node, children, ...props }) => (
          <pre className='text-primary' {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
