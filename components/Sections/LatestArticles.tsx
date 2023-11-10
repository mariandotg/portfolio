import { PreviewArticle } from '@/models/blog/blog.models';
import { ArticlesContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import React from 'react';
import ArticleCard from '../ArticleCard';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { Dictionary } from '@/app/[lang]/dictionaries';
import Card from '../Card';

interface Props {
  latestArticles: PreviewArticle[] | undefined;
  locale: string;
  dict: Dictionary;
  hasAdditionalLink?: boolean;
  basePath: string;
}

const LatestArticles = ({
  latestArticles,
  locale,
  dict,
  hasAdditionalLink = true,
  basePath,
}: Props) => {
  const renderLatestArticles = () =>
    latestArticles?.length !== 0 ? (
      latestArticles?.map((article, index) => (
        <ArticleCard
          article={article}
          path={`${basePath}${article.path}`}
          locale={locale}
          displayDescription
          displayDate
          preview='large'
        />
      ))
    ) : (
      <p className='col-span-1 dark:text-dark-text text-light-text'>
        {dict.latestArticles.notFound}
      </p>
    );

  const additionalLink: AdditionalLink = {
    href: `${locale}/blog`,
    label: dict.latestArticles.additionalLink,
  };

  return (
    <Section>
      <SectionTitle
        additionalLink={hasAdditionalLink ? additionalLink : undefined}
      >
        {dict.latestArticles.title}
      </SectionTitle>
      <div className='flex w-full snap-x tablet:col-span-4'>
        <ul className='flex flex-col w-full gap-8 mobile:gap-4 mobile:grid mobile:grid-cols-2 cards'>
          {renderLatestArticles()}
        </ul>
      </div>
    </Section>
  );
};

export default LatestArticles;
