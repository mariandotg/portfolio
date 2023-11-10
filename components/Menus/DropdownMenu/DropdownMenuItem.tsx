import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  value: string;
}

const DropdownMenuItem = ({ children, value }: Props) => {
  return (
    <li
      value={value}
      tabIndex={0}
      className='flex items-center p-2 rounded-sm cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary text-secondary w-fill gap-x-2 hover:bg-dark-tertiary-pressed/20 hover:dark:bg-light-tertiary-pressed/50'
    >
      {children}
    </li>
  );
};

export default DropdownMenuItem;
