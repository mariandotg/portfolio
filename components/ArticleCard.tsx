import { Article } from '@/models/domain/Article';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdArrowForward } from 'react-icons/md';
import useDate from '@/hooks/useDate';

interface Props {
  article: Article;
  locale: string;
  path: string;
}

const ArticleCard = ({ article, locale, path }: Props) => {
  const { formattedDate } = useDate(new Date(article.date.start!));
  return (
    <div className='flex flex-col gap-y-2'>
      <span className='font-light text-secondary text-light-text dark:text-dark-text'>
        <span className='mr-2'>{formattedDate[locale]}</span>
        <Link href={'/test'} className='underline hover:text-primary'>
          {article.categories[0].name}
        </Link>
      </span>
      <Link href={path} className='flex flex-col gap-y-2'>
        <div className='relative flex w-full overflow-hidden h-[135px] tablet:h-[135px] rounded'>
          <div className='absolute top-0 left-0 z-10 flex items-end justify-center w-full h-full p-4 opacity-100 tablet:opacity-0 group-hover:opacity-100 tablet:bg-dark/25'>
            <MdArrowForward className='absolute w-5 h-5 opacity-100 tablet:opacity-0 right-2 top-2 text-dark-headlines group-hover:opacity-100' />
          </div>
          <Image
            src={article.image}
            alt={`${article.name} image`}
            className='top-0 left-0 object-cover rounded aspect-video'
            fill={true}
          />
        </div>
        <h3 className='font-medium text-title text-dark-headlines font-display'>
          {article.name}
        </h3>
      </Link>
    </div>
  );
};

export default ArticleCard;
