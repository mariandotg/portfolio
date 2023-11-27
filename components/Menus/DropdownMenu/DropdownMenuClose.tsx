'use client';
import { NavBarContext } from '@/lib/NavBarContext';
import React, { useContext } from 'react';

const DropdownMenuClose = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(NavBarContext);

  return (
    <>
      {isMenuOpen && (
        <div
          className='absolute top-0 left-0 w-screen h-screen'
          onClick={() => setIsMenuOpen((prev) => !prev)}
        ></div>
      )}
    </>
  );
};

export default DropdownMenuClose;
