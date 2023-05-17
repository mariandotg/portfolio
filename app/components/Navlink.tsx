import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  children: ReactNode;
  href: string;
}

const Navlink = ({ children, href }: Props) => {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={`${
        href === router.asPath && 'px-2 bg-primary'
      } italic w-fit font-medium text-secondary font-monospace cursor-pointer dark:hover:text-primary hover:text-primary dark:text-dark-headlines text-light-headlines`}
    >
      {children}
    </Link>
  );
};

export default Navlink;
