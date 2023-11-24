import { Dictionary } from '@/app/[lang]/dictionaries';
import { fetchArticles } from '@/services/content/articles';
import React from 'react';
import ArticleCard from './ArticleCard';
import { Icon } from './icons';

interface Props {
  locale: string;
  dict: Dictionary;
}

const ArticlesList = async ({ locale, dict }: Props) => {
  const articles = await fetchArticles(locale);
  const latestArticles = articles?.slice(0, 4);

  const renderLatestArticles = () =>
    latestArticles !== undefined ? (
      latestArticles.map((article, index) => (
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

  return renderLatestArticles();
};

export default ArticlesList;
