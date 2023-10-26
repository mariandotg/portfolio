import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <div className='flex justify-center mt-[56px]'>
      <div className='flex flex-col w-screen tablet:max-w-[800px] desktop:max-w-[832px] px-4 gap-20 tablet:gap-28 tablet:border-x tablet:border-light-subtle-edges tablet:dark:border-dark-subtle-edges'>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
