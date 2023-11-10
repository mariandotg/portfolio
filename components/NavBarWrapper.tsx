'use client';
import React, { useContext, useEffect } from 'react';
import BrandLogo from '../public/public/logo-v2-4.svg';
import { LogoContext } from '@/lib/Context';

interface Props {
  children: React.ReactNode;
}

const NavBarWrapper = ({ children }: Props) => {
  const { showLogo } = useContext(LogoContext);

  useEffect(() => {
    console.log(showLogo);
  }, [showLogo]);

  return (
    <>
      <BrandLogo
        className={`flex tablet:dark:flex w-[164px] fill-dark dark:fill-light group-hover:fill-primary sticky z-[9999] top-3 mr-auto ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
        alt='brand marianoGuillaume logo'
      />
      {children}
    </>
  );
};

export default NavBarWrapper;
