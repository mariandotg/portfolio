import React from 'react';
import PageLayout from '../../../components/PageLayout';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';
import Section from '@/components/Section';
import ArticleCard from '@/components/ArticleCard';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import { getDictionary } from '../dictionaries';

interface Props {
  params: {
    lang: string;
  };
}
interface ArticleData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/blog`
  );

  const articleResponse: ArticleData = await articleFetch.json();

  return metadataAdapter(articleResponse.seo);
}

const BlogPage = async ({ params }: Props) => {
  const articlesFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles`,
    { next: { revalidate: 3600 } }
  );

  const articlesResponse: { articles: Article[] } = await articlesFetch.json();

  const dict = await getDictionary(params.lang);

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col col-span-3 gap-8'>
          <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
            <div className='flex w-full snap-x tablet:col-span-2'>
              <ul className='flex flex-col w-full gap-y-4'>
                {articlesResponse.articles.length !== 0 ? (
                  articlesResponse.articles.map((article, index) => (
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
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;
