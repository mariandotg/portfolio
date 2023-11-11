import React from 'react';
import useDate from '@/hooks/useDate';
import { Metadata } from 'next';
import { getDictionary } from '../../dictionaries';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';
import { getArticleMetadata } from '@/services/api';
import { fetchArticleByPath } from '@/services/content/articles';
import { redirect } from 'next/navigation';
import CustomLink from '@/components/CustomLink';
import 'highlight.js/styles/base16/material-darker.css';

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
      <CustomLink
        href={`../../${params.lang}/blog`}
        icon={{ position: 'before' }}
      >
        {dict.utils.goBack}
      </CustomLink>
      <div className='flex flex-col gap-y-4 tablet:col-span-4'>
        <div className='flex flex-col mt-4 gap-y-5'>
          <div className='flex flex-col gap-y-3'>
            <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
              {article.title}
            </h1>
            <span className='px-2 py-[3px] font-black uppercase border rounded-sm text-secondary text-light-headlines dark:text-dark-headlines font-monospace bg-dark-secondary/10 dark:bg-light-secondary/10 border-light-subtle-edges dark:border-dark-subtle-edges w-fit'>
              {article.category.toLocaleUpperCase()}
            </span>
            <p className='text-secondary dark:text-dark-text text-light-text'>
              {dict.pageIndex.published} {long[params.lang]}
            </p>
          </div>
          <p className='dark:text-dark-text text-light-text'>
            {article.description}
          </p>
        </div>
        <article className='flex flex-col gap-4'>{article.content}</article>
        <div className='flex flex-col gap-2'>
          <h3 className=''>{dict.pageIndex.share}</h3>
          <Share />
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
