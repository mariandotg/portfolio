'use client';
import DropdownMenu from '@/components/Menus/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '@/components/Menus/DropdownMenu/DropdownMenuContent';
import DropdownMenuTrigger from '@/components/Menus/DropdownMenu/DropdownMenuTrigger';
import { NavBarContext } from '@/lib/NavBarContext';
import { ReactNode, useContext, useState } from 'react';

interface Props {
  children: ReactNode;
}

const MenuButton = ({ children }: Props) => {
  const { isMenuOpen, setIsMenuOpen } = useContext(NavBarContext);

  const handleOpenMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <DropdownMenu className='hidden mobile:flex'>
      <DropdownMenuTrigger isOpen={isMenuOpen} onClick={handleOpenMenu} icon />
      <DropdownMenuContent isOpen={isMenuOpen} menuSize='xl' className='top-8'>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;
