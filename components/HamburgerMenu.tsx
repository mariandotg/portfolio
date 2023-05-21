'use client';
import React, { useState } from 'react';
import Button from './Button';
import { MdClose, MdMenu } from 'react-icons/md';
import NavLink from './NavLink';
import LangSelector from './LangSelector';

interface Props {
  locale: string;
}

const HamburgerMenu = ({ locale }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col justify-center select-none'>
      <Button
        variant='primary'
        className='flex mobile:hidden'
        icon
        ariaLabel='Hamburger menu'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <MdClose className='duration-[0ms] w-[18px] h-[18px]' />
        ) : (
          <MdMenu className='duration-[0ms] w-[18px] h-[18px]' />
        )}
      </Button>
      <div className='relative text-light-headlines dark:text-dark-headlines'>
        {isOpen && (
          <ul className='absolute flex justify-between z-20 w-screen px-4 py-3 -left-4 top-[13px] bg-light dark:bg-dark '>
            <li className='w-fit' onClick={() => setIsOpen((prev) => !prev)}>
              <NavLink href={`/${locale}`}>Portfolio</NavLink>
            </li>
            <li className='w-fit' onClick={() => setIsOpen((prev) => !prev)}>
              <NavLink href={`/${locale}/projects`}>Proyectos</NavLink>
            </li>
            <li className='w-fit' onClick={() => setIsOpen((prev) => !prev)}>
              <NavLink href={`/${locale}/blog`}>Blog</NavLink>
            </li>
            <LangSelector locale={locale} />
          </ul>
        )}
      </div>
    </div>
  );
};

export default HamburgerMenu;
