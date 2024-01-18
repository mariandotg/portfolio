import React, { Suspense } from 'react';
import { PreviewArticle } from '@/models/blog/blog.models';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { Dictionary } from '@/app/[lang]/dictionaries';
import ArticlesList from '../ArticlesList';
import ArticlesListFallback from '../ArticlesListFallback';
import ArticleCard from '../ArticleCard';
import { Icon } from '../icons';

interface Props {
  data: PreviewArticle[] | undefined;
  locale: string;
  dict: Dictionary;
  hasAdditionalLink?: boolean;
}

const LatestArticles = ({
  data,
  locale,
  dict,
  hasAdditionalLink = true,
}: Props) => {
  const additionalLink: AdditionalLink = {
    href: `${locale}/blog`,
    label: dict.latestArticles.additionalLink,
  };

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
    <Section>
      <SectionTitle
        additionalLink={hasAdditionalLink ? additionalLink : undefined}
      >
        {dict.latestArticles.title}
      </SectionTitle>
      <div className='flex w-full snap-x tablet:col-span-4'>
        <ul className='grid w-full grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-y-4'>
          {renderLatestArticles()}
          {/* <Suspense fallback={<ArticlesListFallback />}>
            { @ts-ignore }
            <ArticlesList locale={locale} dict={dict} />
          </Suspense> */}
        </ul>
      </div>
    </Section>
  );
};

export default LatestArticles;
