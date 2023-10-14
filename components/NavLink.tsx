'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useIsMounted from '@/hooks/useIsMounted';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className }: Props) => {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const sections = href.split('/');
  const currentSection = pathname.split('/');

  const isActive = isMounted && sections[2] === currentSection[2];
  const active = isActive
    ? 'text-light-secondary dark:text-dark-secondary'
    : 'text-light-secondary/60 dark:text-dark-secondary/60';

  return (
    <Link
      href={href}
      className={`font-medium cursor-pointer w-fit text-secondary hover:text-light-secondary/80 dark:hover:text-dark-secondary/80 ${active} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
