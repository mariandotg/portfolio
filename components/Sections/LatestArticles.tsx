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

  return (
    <Section>
      <SectionTitle
        additionalLink={hasAdditionalLink ? additionalLink : undefined}
      >
        {dict.latestArticles.title}
      </SectionTitle>
      <div className='flex w-full snap-x tablet:col-span-4'>
        <ArticlesList data={data} dict={dict} locale={locale} />
      </div>
    </Section>
  );
};

export default LatestArticles;
