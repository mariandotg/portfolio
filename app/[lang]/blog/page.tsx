import Image from 'next/image';
import React from 'react';
import PageLayout from '../../../components/PageLayout';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';
import PageIndex from '@/components/PageIndex';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import SkillItem from '@/components/SkillItem';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';

interface ArticleData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Article;
}

const BlogPage = async () => {
  const articlesFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/en/api/articles`,
    { cache: 'no-cache' }
  );

  const articlesResponse: { articles: Article[] } = await articlesFetch.json();

  return (
    <PageLayout>
      <Section>
        <SectionTitle emoji='article'>Blog</SectionTitle>
        <div className='flex flex-col col-span-3 gap-8'>
          <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
            <div className='flex w-full snap-x tablet:col-span-3'>
              <ul className='flex flex-col w-full gap-y-4'>
                {articlesResponse.articles.map((article, index) => (
                  <li
                    key={article.id}
                    className={`cursor-pointer group ${
                      index === 0
                        ? 'mobile:col-span-2 tablet:col-span-1'
                        : 'mobile:col-span-1'
                    }`}
                  >
                    <Link
                      href={`/en/blog/${article.path}`}
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
                          <MdArrowForward className='absolute w-5 h-5 opacity-100 tablet:opacity-0 right-2 top-2 text-dark-headlines group-hover:opacity-100' />
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
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;
