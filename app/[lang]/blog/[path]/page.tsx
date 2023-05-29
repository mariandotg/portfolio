import React from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';
import PageIndex from '@/components/PageIndex';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { Article } from '@/models/domain/Article';
import { PageSeo } from '@/models/PageSeo';

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
                <Link
                  href={`en/blog/${article.path}`}
                  className='flex flex-col gap-y-2'
                >
                  <span className='font-light text-secondary text-light-text dark:text-dark-text'>
                    {article.date.start}
                  </span>
                  <div
                    className={`relative flex w-full overflow-hidden h-[135px]  ${
                      index === 0 ? 'mobile:h-[135px]' : 'mobile:h-[100px]'
                    } tablet:h-[135px] rounded`}
                  >
                    <h3 className='absolute z-20 font-medium bottom-2 left-2 text-article text-dark-headlines font-display'>
                      {article.name}
                    </h3>
                    <div className='absolute top-0 left-0 z-10 flex items-end justify-center w-full h-full p-4 opacity-100 tablet:opacity-0 group-hover:opacity-100 tablet:bg-dark/25'>
                      <MdArrowOutward className='absolute w-5 h-5 opacity-100 tablet:opacity-0 right-2 top-2 text-dark-headlines group-hover:opacity-100' />
                    </div>
                    <Image
                      src={article.image}
                      alt={`${article.name} image`}
                      className='top-0 left-0 object-cover rounded aspect-video'
                      fill={true}
                    />
                  </div>
                  <div className='flex flex-row items-center w-full gap-2'>
                    <SkillItem
                      key={article.tags[0].id}
                      skill={article.tags[0].name}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ArticlePage;
