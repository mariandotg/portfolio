import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}
const PageLayout = ({ children, className }: Props) => {
  return (
    <div className='flex justify-center mt-[56px] overflow-hidden'>
      <div
        className={`flex flex-col w-screen tablet:max-w-2xl px-4 gap-20 tablet:gap-28 tablet:border-x tablet:border-light-subtle-edges tablet:dark:border-dark-subtle-edges ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
