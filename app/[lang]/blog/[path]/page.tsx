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
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getArticle, getArticleMetadata } from '@/services/api';

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
  return await getArticleMetadata(params.lang, params.path);
}

const ArticlePage = async ({ params }: Props) => {
  const article = await getArticle(params.lang, params.path);

  const articleResponse: ArticleData = article;
  const { formattedDate } = useDate(
    // @ts-ignore
    new Date(articleResponse.publishedAt)
  );
  const dict = await getDictionary(params.lang);

  const renderTags = () =>
    articleResponse.properties.tags.map((tag, index) => (
      <li>
        <SkillItem key={tag.id} skill={tag.name} variant='base' />
      </li>
    ));

  return (
    <>
      <div className='flex flex-col col-span-4 gap-y-2'>
        <div className='relative h-64 tablet:col-span-4'>
          <Image
            src={articleResponse.image.data.attributes.url}
            alt='page header'
            className='absolute object-cover rounded'
            fill={true}
            priority
            quality={90}
            placeholder='blur'
            blurDataURL={articleResponse.image.data.attributes.placeholder}
          />
        </div>
      </div>
      <div className='flex flex-col gap-y-4 tablet:col-span-2'>
        <div className='flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
              {articleResponse.title}
            </h1>
            <span className='flex px-2 italic font-medium rounded font-monospace text-dark-headlines bg-dark-tertiary-hover dark:bg-light-tertiary-hover w-fit'>
              {articleResponse.category.toLocaleUpperCase()}
            </span>
          </div>
          <p className='dark:text-dark-text text-light-text'>
            {articleResponse.description}
          </p>
        </div>
        <Markdown>{articleResponse.content}</Markdown>
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
