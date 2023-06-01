import React from 'react';
import PageLayout from '../../../components/PageLayout';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import ArticleCard from '@/components/ArticleCard';

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
                    <ArticleCard article={article} />
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
