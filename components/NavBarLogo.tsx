'use client';
import React, { useContext, useEffect } from 'react';
import BrandLogo from '../public/public/logo-v2-4.svg';
import { NavBarContext } from '@/lib/NavBarContext';
import Link from 'next/link';

const NavBarLogo = () => {
  const { showLogo } = useContext(NavBarContext);

  useEffect(() => {
    console.log(showLogo);
  }, [showLogo]);

  return (
    <BrandLogo
      className={`flex tablet:dark:flex w-[164px] fill-dark dark:fill-light group-hover:fill-primary sticky z-[9999] top-3  ${
        showLogo ? 'opacity-100' : 'opacity-0'
      }`}
      alt='brand marianoGuillaume logo'
    />
  );
};

export default NavBarLogo;
