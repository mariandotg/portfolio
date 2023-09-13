import Link from 'next/link';
import React from 'react';
import { MdArrowForward } from 'react-icons/md';
import { PreviewArticle } from '@/models/blog/blog.models';

interface Props {
  article: PreviewArticle;
  displayDescription?: boolean;
  path: string;
}

const ArticleCard = ({ article, displayDescription, path }: Props) => {
  return (
    <div className='flex flex-col col-span-1 mobile:col-span-2 gap-y-2'>
      <Link href={path} className='flex flex-col gap-y-2 group'>
        <div className='relative flex w-full overflow-hidden h-[135px] tablet:h-[135px] rounded'>
          <span className='absolute z-20 px-2 py-1 font-black uppercase rounded-sm text-secondary top-2 left-2 text-dark-headlines font-monospace bg-dark/75'>
            {article.category}
          </span>
          <div className='absolute top-0 left-0 z-10 flex items-end justify-center w-full h-full p-4 duration-500 opacity-100 tablet:opacity-0 group-hover:opacity-100 tablet:bg-dark/25'>
            <MdArrowForward className='absolute w-5 h-5 opacity-100 tablet:opacity-0 right-2 top-2 text-dark-headlines group-hover:opacity-100' />
          </div>
          <img
            src={article.image.url}
            alt={`${article.image.alternativeText} image`}
            className='top-0 left-0 object-cover w-full rounded aspect-video'
          />
        </div>
        <h3 className='font-medium underline transition-all duration-500 text text-dark-headlines font-display underline-offset-2 decoration-dark-headlines group-hover:decoration-primary group-hover:text-primary'>
          {article.title}
        </h3>
      </Link>
      {displayDescription && (
        <p className='text-secondary dark:text-dark-text text-light-text'>
          {article.description}
        </p>
      )}
    </div>
  );
};

export default ArticleCard;
