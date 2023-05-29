import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <div className='flex justify-center mt-20'>
      <div className='flex flex-col w-screen tablet:max-w-[800px] px-4 tablet:p-0 gap-16'>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
