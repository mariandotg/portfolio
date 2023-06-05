import React from 'react';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';
import { Article } from '@/models/domain/Article';
import { PageSeo } from '@/models/PageSeo';
import useDate from '@/hooks/useDate';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import { getDictionary } from '../../dictionaries';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

interface ArticleData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/${params.path}`,
    { cache: 'no-cache' }
  );

  const articleResponse: ArticleData = await articleFetch.json();

  return metadataAdapter(articleResponse.seo);
}

const ArticlePage = async ({ params }: Props) => {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/${params.path}`,
    { cache: 'no-cache' }
  );

  const articleResponse: ArticleData = await articleFetch.json();

  const { formattedDate } = useDate(
    new Date(articleResponse.properties.date.start!)
  );
  const dict = await getDictionary(params.lang);

  const renderTags = () =>
    articleResponse.properties.tags.map((tag, index) => (
      <li>
        <SkillItem key={tag.id} skill={tag.name} />
      </li>
    ));

  return (
    <>
      <div className='flex flex-col gap-y-4 tablet:col-span-2'>
        <div className='flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
              {articleResponse.properties.name}
            </h1>
            {articleResponse.properties.categories.map((tag, index) => (
              <span className='flex px-2 italic font-medium rounded font-monospace text-dark-headlines bg-dark-tertiary-hover dark:bg-light-tertiary-hover w-fit'>
                {(tag.name as String).toLocaleUpperCase()}
              </span>
            ))}
          </div>
          <p className='dark:text-dark-text text-light-text'>
            {articleResponse.properties.description}
          </p>
        </div>
        <Markdown>{articleResponse.content.parent}</Markdown>
        <p>
          {dict.pageIndex.published} {formattedDate[params.lang]}
        </p>
      </div>
      <div className='sidebar'>
        <div className='sidebar-group'>
          <h3 className='sidebar-group-title'>{dict.pageIndex.tags}</h3>
          <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
            {renderTags()}
          </ul>
        </div>
        <div className='sticky top-[73px] flex flex-col gap-y-4'>
          <div className='hidden tablet:sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.content}</h3>
            <PageIndexes />
          </div>
          <div className='sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.share}</h3>
            <Share />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
