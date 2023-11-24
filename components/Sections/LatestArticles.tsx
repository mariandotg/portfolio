import React, { Suspense } from 'react';
import { PreviewArticle } from '@/models/blog/blog.models';
import Section from './Section/Section';
import SectionTitle, { AdditionalLink } from './Section/SectionTitle';
import { Dictionary } from '@/app/[lang]/dictionaries';
import ArticlesList from '../ArticlesList';
import ArticlesListFallback from '../ArticlesListFallback';

interface Props {
  latestArticles?: PreviewArticle[] | undefined;
  locale: string;
  dict: Dictionary;
  hasAdditionalLink?: boolean;
  basePath?: string;
}

const LatestArticles = ({ locale, dict, hasAdditionalLink = true }: Props) => {
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
          <Suspense fallback={<ArticlesListFallback />}>
            {/* @ts-ignore */}
            <ArticlesList locale={locale} dict={dict} />
          </Suspense>
        </ul>
      </div>
    </Section>
  );
};

export default LatestArticles;
