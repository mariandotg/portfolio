'use client';
import { createQueryString } from '@/lib/createQueryString';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import PaginationButton from './PaginationButton';

interface Props {
  totalPages: number;
}

const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryStringCallback = useCallback(
    (name: string, value: string) => {
      return createQueryString(searchParams, name, value);
    },
    [searchParams]
  );

  return (
    <ul className='flex flex-row justify-end col-start-4 gap-2 mobile:col-start-5 font-display text text-light-text dark:text-dark-text'>
      {Array.from({ length: totalPages }).map((item, index) => {
        const href = `${pathname}?${createQueryStringCallback(
          'page',
          `${index + 1}`
        )}`;
        return <PaginationButton href={href} pageNumber={index + 1} />;
      })}
    </ul>
  );
};

export default Pagination;
