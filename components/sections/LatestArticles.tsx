import { PreviewArticle } from '@/models/blog/blog.models';
import { ArticlesContent } from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';
import React from 'react';
import ArticleCard from '../ArticleCard';
import Section from '../Section';
import SectionTitle, { AdditionalLink } from '../SectionTitle';
import { Dictionary } from '@/app/[lang]/dictionaries';

interface Props {
  data: FormattedSection<ArticlesContent>;
  latestArticles: PreviewArticle[] | undefined;
  locale: string;
  dict: Dictionary;
}

const LatestArticles = ({ data, latestArticles, locale, dict }: Props) => {
  const renderLatestArticles = () =>
    latestArticles?.length !== 0 ? (
      latestArticles?.map((article, index) => (
        <ArticleCard
          article={article}
          path={`${locale}/blog/${article.path}`}
          locale={locale}
        />
      ))
    ) : (
      <p className='col-span-1 dark:text-dark-text text-light-text'>
        {dict.latestArticles.notFound}
      </p>
    );

  const additionalLink: AdditionalLink = {
    href: `${locale}/blog`,
    label: 'See my blog',
  };

  return (
    <Section>
      <SectionTitle emoji={data.emoji} additionalLink={additionalLink}>
        {data.title}
      </SectionTitle>
      <div className='flex w-full snap-x tablet:col-span-4'>
        <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
          {renderLatestArticles()}
        </ul>
      </div>
    </Section>
  );
};

export default LatestArticles;
