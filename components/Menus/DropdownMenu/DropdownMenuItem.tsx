'use client';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  value: string;
  onClick?: (e?: any) => void;
  onKeyDown?: (e?: any) => void;
  disabled?: boolean;
  className?: string;
}

const DropdownMenuItem = ({
  children,
  value,
  onClick,
  onKeyDown,
  disabled = false,
  className,
}: Props) => {
  return (
    <li
      value={value}
      tabIndex={0}
      className={`flex items-center p-2 rounded-sm text-light-secondary/60 dark:text-dark-secondary/60 text-secondary w-fill gap-x-2 ${
        disabled
          ? 'cursor-not-allowed text-dark-tertiary-pressed'
          : 'cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:dark:text-dark-secondary hover:text-light-secondary hover:text-light-secondary/80 hover:bg-dark-tertiary-pressed/20 hover:dark:bg-light-tertiary-pressed/50 dark:hover:text-dark-secondary/80'
      } ${className}`}
      onKeyDown={(e) => {
        if (!disabled && onKeyDown) onKeyDown(e);
      }}
      onClick={(e) => {
        if (!disabled && onClick) onClick(e);
      }}
    >
      {children}
    </li>
  );
};

export default DropdownMenuItem;
