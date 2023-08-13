import React from 'react';
import PageLayout from '../../../components/PageLayout';
import Section from '@/components/Section';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';
import { getDictionary } from '../dictionaries';
import FilterByTag from '@/components/FilterByTag';
import { getArticles, getPageMetadata } from '@/services/api';

interface Props {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getPageMetadata(params.lang, 'blog');
}

const BlogPage = async ({ params }: Props) => {
  const articles = await getArticles(params.lang);
  const dict = await getDictionary(params.lang);

  return (
    <PageLayout>
      <Section>
        <div className=''>
          <div className='sidebar-group'>
            <h3 className='sidebar-group-title'>tags</h3>
            <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
              <FilterByTag />
            </ul>
          </div>
        </div>
        <div className='flex flex-col col-span-4 gap-8 mobile:grid mobile:grid-cols-3 mobile:gap-4 tablet:col-span-4 tablet:gap-4'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:col-span-3 mobile:grid-cols-3'>
            {articles.length !== 0 ? (
              articles.map((article, index) => (
                <li
                  key={article.id}
                  className={`cursor-pointer group ${
                    index === 0
                      ? 'mobile:col-span-2 tablet:col-span-1'
                      : 'mobile:col-span-1'
                  }`}
                >
                  <ArticleCard
                    article={article}
                    path={`${params.lang}/blog/${article.path}`}
                    locale={params.lang}
                  />
                </li>
              ))
            ) : (
              <p className='col-span-1 dark:text-dark-text text-light-text'>
                {dict.blog.notFound}
              </p>
            )}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;
