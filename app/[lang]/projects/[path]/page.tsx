import React from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { getNotionSinglePage } from '@/services/notion';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface Props {
  params: {
    path: string;
  };
}

const ProjectPage = async ({ params }: Props) => {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const blogResponse = await getNotionSinglePage({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: params.path,
        },
      },
    },
  });

  return (
    <>
      <div className='relative h-64 bg-primary'></div>
      <PageLayout>
        <div className='flex flex-col gap-y-4'>
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
              p: ({ node, ...props }) => (
                <p className='dark:text-dark-text text-light-text' {...props} />
              ),
              img: ({ node, src, alt, width, height }) => (
                <Image
                  className='dark:text-dark-text text-light-text'
                  src={src!}
                  alt={alt!}
                  width={100}
                  height={50}
                />
              ),
            }}
          >
            {blogResponse?.markdown.parent}
          </ReactMarkdown>
        </div>
      </PageLayout>
    </>
  );
};

export default ProjectPage;
