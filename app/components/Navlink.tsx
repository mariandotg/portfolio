'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  exact: boolean;
  children: ReactNode;
  className?: string;
}

const NavLink = ({ href, exact, children, ...props }: Props) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const active = isActive ? ' px-2 bg-primary' : '';

  return (
    <Link
      href={href}
      className={`italic font-medium cursor-pointer w-fit text-secondary font-monospace dark:hover:text-primary hover:text-primary dark:text-dark-headlines text-light-headlines${active}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
