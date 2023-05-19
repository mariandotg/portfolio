'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useIsMounted from '@/hooks/useIsMounted';

interface Props {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: Props) => {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const isActive = isMounted && pathname === href;
  const active = isActive
    ? ' px-2 bg-primary dark:hover:bg-dark-primary-hover hover:bg-light-primary-hover'
    : ' dark:hover:text-primary hover:text-primary';

  return (
    <Link
      href={href}
      className={`italic font-medium cursor-pointer w-fit text-secondary font-monospace dark:text-dark-headlines text-light-headlines${active}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
