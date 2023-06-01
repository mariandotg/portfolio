import React from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';
import PageIndex from '@/components/PageIndex';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import { Article } from '@/models/domain/Article';
import { PageSeo } from '@/models/PageSeo';
import ArticleCard from '@/components/ArticleCard';

interface Props {
  params: {
    path: string;
  };
}

interface ArticleData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Article;
}

const ArticlePage = async ({ params }: Props) => {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/en/api/articles/${params.path}`,
    { cache: 'no-cache' }
  );
  const latestArticlesFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/en/api/articles/latest`,
    { cache: 'no-cache' }
  );

  const articleResponse: ArticleData = await articleFetch.json();
  const latestArticlesResponse: Article[] = await latestArticlesFetch.json();

  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
        <div className='flex flex-col col-span-3 gap-y-2'>
          <div className='relative h-64 tablet:col-span-3'>
            <Image
              src={articleResponse.properties.image}
              alt='page header'
              className='absolute object-cover rounded'
              fill={true}
              priority
              quality={90}
            />
          </div>
        </div>
        <div className='flex flex-col gap-y-4 tablet:col-span-2'>
          <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
                {articleResponse.properties.name}
              </h1>
            </div>
            <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
              {articleResponse.properties.tags.map((tag, index) => (
                <li>
                  <SkillItem key={tag.id} skill={tag.name} />
                </li>
              ))}
            </ul>
          </div>
          <Markdown>{articleResponse.content.parent}</Markdown>
        </div>
        <PageIndex />
      </div>
      <Section>
        <SectionTitle>Latest Articles</SectionTitle>
        <div className='flex w-full snap-x tablet:col-span-3'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
            {latestArticlesResponse.map((article, index) => (
              <li
                key={article.id}
                className={`cursor-pointer group ${
                  index === 0
                    ? 'mobile:col-span-2 tablet:col-span-1'
                    : 'mobile:col-span-1'
                }`}
              >
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ArticlePage;
