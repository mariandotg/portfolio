import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const DropdownMenu = ({ children, className }: Props) => {
  return (
    <div
      className={`relative flex flex-col justify-center select-none z-[9999] ${className}`}
    >
      {children}
    </div>
  );
};

export default DropdownMenu;
