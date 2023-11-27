import React, { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  children: ReactNode;
  menuSize?: 'sm' | 'xl';
  className?: string;
}

const DropdownMenuContent = ({
  isOpen,
  children,
  menuSize,
  className,
}: Props) => {
  return (
    <div
      className={`absolute right-0 ${
        menuSize === 'sm' ? 'w-full' : 'w-32 -right-[33%]'
      } text-light-headlines dark:text-dark-headlines z-[9998] ${className}`}
    >
      {isOpen && (
        <ul className='z-20 my-1 flex flex-col gap-y-1 text-right w-full rounded p-1 bg-light dark:bg-dark border-[1px] border-light-subtle-edges dark:border-dark-subtle-edges'>
          {children}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenuContent;
