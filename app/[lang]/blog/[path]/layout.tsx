import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Sections/Section/Section';
import SectionTitle from '@/components/Sections/Section/SectionTitle';
import { fetchArticles } from '@/services/content/articles';
import LatestArticles from '@/components/Sections/LatestArticles';
import { getDictionary } from '../../dictionaries';

interface Props {
  children: React.ReactNode;
  params: {
    lang: string;
    path: string;
  };
}

export async function generateStaticParams() {
  const articles = await fetchArticles('en');
  const langs = [{ lang: 'en' }, { lang: 'es' }];

  return langs.flatMap(({ lang }) => {
    return articles!.map((product) => ({
      path: product.path,
      lang,
    }));
  });
}

const ArticleLayout = async ({ children, params }: Props) => {
  const articles = await fetchArticles(params.lang);
  const latestArticles = articles?.slice(0, 2);
  const dict = await getDictionary(params.lang);

  return (
    <PageLayout className='pt-4 pb-32'>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
        {children}
      </div>
      <LatestArticles
        data={latestArticles}
        locale={params.lang}
        dict={dict}
        hasAdditionalLink={false}
      />
    </PageLayout>
  );
};

export default ArticleLayout;
