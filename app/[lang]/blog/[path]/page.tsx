import React from 'react';
import Image from 'next/image';
import { getNotionSinglePage, queryNotionDatabase } from '@/services/notion';
import { articlesAdapter } from '@/adapters/articlesAdapter';
import PageLayout from '@/components/PageLayout';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';

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
          <Markdown>{blogResponse?.markdown.parent}</Markdown>
        </div>
      </div>
    </PageLayout>
  );
};

export default ArticlePage;
