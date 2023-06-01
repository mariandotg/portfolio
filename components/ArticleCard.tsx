import { Article } from '@/models/domain/Article';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdArrowForward } from 'react-icons/md';
import SkillItem from './SkillItem';
import useDate from '@/hooks/useDate';

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  const { formattedDate } = useDate(new Date(article.date.start!));

  return (
    <Link href={`en/blog/${article.path}`} className='flex flex-col gap-y-2'>
      <span className='font-light text-secondary text-light-text dark:text-dark-text'>
        {formattedDate['es']}
      </span>
      <div className='relative flex w-full overflow-hidden h-[135px] tablet:h-[135px] rounded'>
        <h3 className='absolute z-20 font-medium bottom-2 left-2 text-article text-dark-headlines font-display'>
          {article.name}
        </h3>
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
      <div className='flex flex-row items-center w-full gap-2'>
        <SkillItem key={article.tags[0].id} skill={article.tags[0].name} />
      </div>
    </Link>
  );
};

export default ArticleCard;
