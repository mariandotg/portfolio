import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const DropdownMenu = ({ children }: Props) => {
  return (
    <div
      className={`relative flex flex-col justify-center select-none z-[9999] `}
    >
      {children}
    </div>
  );
};

export default DropdownMenu;
