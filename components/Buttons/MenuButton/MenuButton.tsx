'use client';
import DropdownMenu from '@/components/Menus/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '@/components/Menus/DropdownMenu/DropdownMenuContent';
import DropdownMenuTrigger from '@/components/Menus/DropdownMenu/DropdownMenuTrigger';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

const MenuButton = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prevValue: boolean) => !prevValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger isOpen={isOpen} onClick={handleOpenMenu} icon />
      <DropdownMenuContent isOpen={isOpen} menuSize='xl'>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuButton;
