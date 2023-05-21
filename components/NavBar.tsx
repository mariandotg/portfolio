'use client';
import React from 'react';
import {
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdKeyboardArrowUp,
} from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import useTheme from '@/hooks/useTheme';
import useScroll from '@/hooks/useScroll';
import useIsMounted from '@/hooks/useIsMounted';

import Button from './Button';
import Image from 'next/image';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import HamburgerMenu from './HamburgerMenu';

interface Props {
  locale: string;
}

const NavBar = ({ locale }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const { visible, scrollToTop } = useScroll();
  const isMounted = useIsMounted();

  return (
    <header className='border-b-[1px] border-primary bg-light/80 z-[9999] dark:bg-dark/70 backdrop-saturate-200 fixed top-0 flex justify-center w-full px-4 py-3 backdrop-blur'>
      <nav className='relative flex items-center w-screen tablet:max-w-[800px] justify-between gap-16'>
        <div className='items-center hidden gap-4 mobile:flex dark:text-light'>
          <NavLink href={`/${locale}`}>Portfolio</NavLink>
          <NavLink href={`/${locale}/projects`}>Proyectos</NavLink>
          <NavLink href={`/${locale}/blog`}>Blog</NavLink>
        </div>
        <Image
          src='/marianoGuillaume.svg'
          alt='brand marianoGuillaume logo'
          className='absolute left-2/4 -translate-x-1/2 flex mobile:hidden tablet:dark:flex tablet:flex dark:brightness-[200] w-[164px]'
          width={164}
          height={14}
        />
        <Image
          src='/mdg.svg'
          alt='brand mdg logo'
          className='absolute hidden -translate-x-1/2 mobile:flex left-2/4 tablet:hidden dark:brightness-[200]'
          width={50}
          height={23}
        />
        <HamburgerMenu locale={locale} />
        <div className='relative flex items-center gap-2'>
          <div className='hidden mobile:flex'>
            <LangSelector locale={locale} />
          </div>
          <Button
            variant='primary'
            onClick={toggleTheme}
            icon
            disabled={!isMounted}
            ariaLabel='Change theme'
          >
            {isMounted ? (
              theme === 'dark' ? (
                <MdLightMode className='duration-[0ms] w-[18px] h-[18px]' />
              ) : (
                <MdDarkMode className='duration-[0ms] w-[18px] h-[18px]' />
              )
            ) : (
              <FaSpinner className='duration-[0ms] w-[18px] h-[18px]' />
            )}
          </Button>
          <Button
            variant='primary'
            onClick={scrollToTop}
            className='flex'
            icon
            disabled={!visible}
            ariaLabel='Scroll to the top'
          >
            <MdKeyboardArrowUp className='duration-[0ms] w-[18px] h-[18px] ' />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
