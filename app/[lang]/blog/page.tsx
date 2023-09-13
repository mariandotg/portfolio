import React from 'react';
import PageLayout from '../../../components/PageLayout';
import Section from '@/components/Section';
import ArticleCard from '@/components/ArticleCard';
import { getDictionary } from '../dictionaries';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Meta } from '@/models/blog/blog.models';
import useDate from '@/hooks/useDate';

interface Props {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<{ seo: Meta }>('blog', params.lang);
  return metadataAdapter(data!.seo);
}

const BlogPage = async ({ params }: Props) => {
  const articles = await fetchArticles(params.lang);
  const dict = await getDictionary(params.lang);

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col col-span-4 gap-8 mobile:grid mobile:grid-cols-3 mobile:gap-4 tablet:col-span-4 tablet:gap-4'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:col-span-3 mobile:grid-cols-3'>
            {articles !== undefined ? (
              articles.map((article) => {
                const { long } = useDate(new Date(article.publishedAt));
                return (
                  <li
                    key={article.id}
                    className='grid grid-cols-1 mobile:grid-cols-3 group mobile:col-span-3'
                  >
                    <p className='col-span-1 text-secondary text-light-text dark:text-dark-text'>
                      {long[params.lang]}
                    </p>
                    <ArticleCard
                      article={article}
                      path={`blog/${article.path}`}
                      displayDescription
                    />
                  </li>
                );
              })
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
