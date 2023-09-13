import React from 'react';
import useDate from '@/hooks/useDate';
import { Metadata } from 'next';
import { getDictionary } from '../../dictionaries';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';
import { getArticleMetadata } from '@/services/api';
import { fetchArticleByPath } from '@/services/content/articles';
import { redirect } from 'next/navigation';

export const revalidate = 86400;

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getArticleMetadata(params.lang, params.path);
}

const ArticlePage = async ({ params }: Props) => {
  const dict = await getDictionary(params.lang);
  const article = await fetchArticleByPath(params.path, params.lang);

  if (!article) return redirect(`../../${params.lang}/blog/not-found`);

  const { long } = useDate(new Date(article.publishedAt));

  return (
    <>
      <div className='flex flex-col col-span-4 gap-y-2'>
        <div className='relative h-64 overflow-hidden rounded tablet:col-span-4'>
          <img
            src={article.image}
            alt='page header'
            className='object-cover'
            placeholder='blur'
          />
        </div>
      </div>
      <div className='flex flex-col gap-y-4 tablet:col-span-2'>
        <div className='flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
              {article.title}
            </h1>
            <span className='flex px-2 italic font-medium rounded font-monospace text-dark-headlines bg-dark-tertiary-hover dark:bg-light-tertiary-hover w-fit'>
              {article.category.toLocaleUpperCase()}
            </span>
          </div>
          <p className='dark:text-dark-text text-light-text'>
            {article.description}
          </p>
        </div>
        <article>{article.content}</article>
        <p>
          {dict.pageIndex.published} {long[params.lang]}
        </p>
      </div>
      <div className='sidebar'>
        <div className='sidebar-group'>
          <h3 className='sidebar-group-title'>{dict.pageIndex.tags}</h3>
          <ul className='flex flex-row flex-wrap items-center w-full gap-2'></ul>
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
