import { Dictionary } from '@/app/[lang]/dictionaries';
import { fetchArticles } from '@/services/content/articles';
import React from 'react';
import ArticleCard from './ArticleCard';
import { Icon } from './icons';
import { PreviewArticle } from '@/models/blog/blog.models';

interface Props {
  data: PreviewArticle[] | undefined;
  locale: string;
  dict: Dictionary;
}

const ArticlesList = ({ data, locale, dict }: Props) => {
  const renderLatestArticles = () =>
    data !== undefined ? (
      data.map((article) => (
        <ArticleCard
          article={article}
          path={`/${locale}/blog/${article.path}`}
          locale={locale}
          displayDescription
          displayDate
          preview='large'
        />
      ))
    ) : (
      <li className='flex items-center col-span-4 gap-2 px-4 py-2 border rounded mobile:col-span-5 text-warning dark:text-warning border-warning bg-warning/25'>
        <Icon value='solidWarning' width={24} height={24} />
        {dict.latestArticles.notFound}
      </li>
    );

  return (
    <ul className='grid w-full grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-y-4'>
      {renderLatestArticles()}
      {/* <Suspense fallback={<ArticlesListFallback />}>
    { @ts-ignore }
    <ArticlesList locale={locale} dict={dict} />
  </Suspense> */}
    </ul>
  );
};

export default ArticlesList;
