import React from 'react';
import PageLayout from '../../../components/PageLayout';
import Section from '@/components/Sections/Section/Section';
import ArticleCard from '@/components/ArticleCard';
import { getDictionary } from '../dictionaries';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Meta } from '@/models/blog/blog.models';

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

  const renderArticleCards = () =>
    articles !== undefined ? (
      articles.map((article) => (
        <ArticleCard
          article={article}
          path={`blog/${article.path}`}
          locale={params.lang}
          displayDescription
          displayDate
          preview='large'
        />
      ))
    ) : (
      <p className='col-span-1 dark:text-dark-text text-light-text'>
        {dict.blog.notFound}
      </p>
    );

  return (
    <PageLayout className='py-32'>
      <Section>
        <div className='flex flex-col col-span-4 gap-8 mobile:grid mobile:grid-cols-3 mobile:gap-4 tablet:col-span-4 tablet:gap-4'>
          <h1 className='mobile:col-span-3 text-title text-light-headlines dark:text-dark-headlines'>
            Welcome to my blog.
          </h1>
          <p className='mobile:col-span-3 font-display text text-light-text dark:text-dark-text'>
            This is where I share my passion about programming and design. I
            believe in a practical approach, so here I document my latest
            explorations.
          </p>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:col-span-3 mobile:grid-cols-3'>
            {renderArticleCards()}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;
