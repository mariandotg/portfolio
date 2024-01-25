'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  pageNumber: number;
  href: string;
}

const PaginationButton = ({ pageNumber, href }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.getAll('page')[0] || '1';

  return (
    <li
      className={`${
        +currentPage === pageNumber
          ? 'bg-primary border-transparent hover:bg-primary/80 text-dark-text'
          : 'bg-transparent border-light-text dark:border-dark-text dark:hover:bg-dark-subtle-edges hover:bg-light-subtle-edges dark:text-dark-text text-light-text'
      } rounded-full cursor-pointer text-[14px]/[14px] w-6 h-6 flex items-center justify-center border`}
      onClick={() => router.push(href)}
      key={`pagination-${pageNumber}-button`}
    >
      {pageNumber}
    </li>
  );
};

export default PaginationButton;
