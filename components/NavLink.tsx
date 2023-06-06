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

  const sections = href.split('/');
  const currentSection = pathname.split('/');

  const isActive = isMounted && sections[2] === currentSection[2];
  const active = isActive
    ? ' text-dark-headlines underline font-medium underline-offset-2 decoration-2 text-primary decoration-primary dark:hover:text-dark-primary-hover hover:text-light-primary-hover'
    : ' dark:text-dark-headlines text-light-headlines dark:hover:text-primary hover:text-primary';

  return (
    <Link
      href={href}
      className={`italic font-light cursor-pointer w-fit text-secondary font-monospace${active}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
