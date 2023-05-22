import React from 'react';
import PageLayout from '@/components/PageLayout';
import { getNotionSinglePage, queryNotionDatabase } from '@/services/notion';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { articlesAdapter } from '@/adapters/articlesAdapter';
import Image from 'next/image';
import SkillItem from '@/components/SkillItem';

interface Props {
  params: {
    path: string;
  };
}

const ArticlePage = async ({ params }: Props) => {
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

  const blogMetadata = articlesAdapter(
    await queryNotionDatabase({
      databaseId,
      filter: {
        property: 'SeoPath',
        formula: {
          string: {
            equals: params.path,
          },
        },
      },
    })
  );

  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text'>
        <div className='flex flex-col gap-y-2'>
          <div className='relative h-64 mt-20'>
            <Image
              src={blogMetadata[0].image}
              alt='page header'
              className='absolute object-cover rounded'
              fill={true}
              priority
              quality={90}
            />
          </div>
          <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
                {blogMetadata[0].name}
              </h1>
            </div>
            <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
              {blogMetadata[0].tags.map((tag, index) => (
                <li>
                  <SkillItem key={tag.id} skill={tag.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
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
              pre: ({ node, children, ...props }) => {
                console.log(children);
                return <pre className='text-primary' {...props} />;
              },
            }}
          >
            {blogResponse?.markdown.parent}
          </ReactMarkdown>
        </div>
      </div>
    </PageLayout>
  );
};

export default ArticlePage;
