import { PreviewArticle } from '@/models/blog/blog.models';
import { ArticlesContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import React from 'react';
import ArticleCard from '../ArticleCard';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { Dictionary } from '@/app/[lang]/dictionaries';
import Card from '../Card';
import { Icon } from '../icons';

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
  console.log(latestArticles);
  const renderLatestArticles = () =>
    latestArticles !== undefined ? (
      latestArticles.map((article, index) => (
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
      <li className='flex items-center col-span-4 gap-2 px-4 py-2 border rounded mobile:col-span-5 text-warning dark:text-warning border-warning bg-warning/25'>
        <Icon value='solidWarning' width={24} height={24} />
        {dict.latestArticles.notFound}
      </li>
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
        <ul className='grid w-full grid-cols-4 col-span-4 mobile:col-span-5 mobile:grid-cols-5 gap-y-4'>
          {renderLatestArticles()}
        </ul>
      </div>
    </Section>
  );
};

export default LatestArticles;
