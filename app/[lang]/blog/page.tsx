import React, { Suspense } from 'react';
import PageLayout from '../../../components/PageLayout';
import Section from '@/components/Sections/Section/Section';
import ArticleCard from '@/components/ArticleCard';
import { getDictionary } from '../dictionaries';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Meta } from '@/models/blog/blog.models';
import { Icon } from '@/components/icons';
import ArticlesListFallback from '@/components/ArticlesListFallback';
import ArticlesList from '@/components/ArticlesList';

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
  const dict = await getDictionary(params.lang);

  return (
    <PageLayout className='py-32'>
      <Section>
        <div className='grid grid-cols-4 gap-y-8 mobile:grid-cols-5 mobile:gap-4 tablet:col-span-4'>
          <div className='flex flex-col col-span-4 gap-4 mobile:col-span-5 min-h-[96px]'>
            <h1 className='italic font-semibold text-article text-light-headlines dark:text-dark-headlines font-monospace'>
              {dict.blog.title}
            </h1>
            <p className='font-display text text-light-text dark:text-dark-text'>
              {dict.blog.description}
            </p>
          </div>
          <ul className='grid w-full grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-y-4'>
            <Suspense fallback={<ArticlesListFallback />}>
              {/* @ts-ignore */}
              <ArticlesList locale={params.lang} dict={dict} />
            </Suspense>
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default BlogPage;
