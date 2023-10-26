import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Chip = ({ children }: Props) => {
  return (
    <li className='relative whitespace-nowrap flex text-[14px]/[14px] bg-primary/10 border border-primary text-light-headlines dark:text-dark-headlines px-2 py-1 rounded-[50px] items-center justify-center group/item gap-x-2 flex-shrink bg-light dark:bg-dark z-[9999]'>
      {children}
    </li>
  );
};

export default Chip;
