import React from 'react';
import Markdown from '@/components/Markdown';
import useDate from '@/hooks/useDate';
import { Metadata } from 'next';
import { getDictionary } from '../../dictionaries';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';
import Image from 'next/image';
import { getArticle, getArticleMetadata } from '@/services/api';
import { NEXT_PUBLIC_API_URL } from '@/config';

export const revalidate = 86400;

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

export async function generateStaticParams() {
  const products = await fetch(
    `${NEXT_PUBLIC_API_URL}/articles?fields[0]=path`,
    { cache: 'force-cache' }
  ).then((res) => res.json());
  const langs = [{ lang: 'en' }, { lang: 'es' }];

  console.log('generateStaticParams', products);
  return langs.map((lang) => {
    //@ts-ignore
    return products.data.map((product) => ({
      path: product.attributes.path,
      lang,
    }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getArticleMetadata(params.lang, params.path);
}

const ArticlePage = async ({ params }: Props) => {
  const article = await getArticle(params.lang, params.path);
  const { formattedDate } = useDate(new Date(article.publishedAt));
  const dict = await getDictionary(params.lang);

  return (
    <>
      <div className='flex flex-col col-span-4 gap-y-2'>
        <div className='relative h-64 tablet:col-span-4'>
          <Image
            src={article.image.data.attributes.url}
            alt='page header'
            className='absolute object-cover rounded'
            fill={true}
            priority
            quality={90}
            placeholder='blur'
            blurDataURL={article.image.data.attributes.placeholder}
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
        <Markdown>{article.content}</Markdown>
        <p>
          {dict.pageIndex.published} {formattedDate[params.lang]}
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
