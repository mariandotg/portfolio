import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <div className='flex justify-center mt-[73px]'>
      <div className='flex flex-col w-screen tablet:max-w-[800px] px-4 desktop:p-0 gap-20 tablet:gap-28'>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
