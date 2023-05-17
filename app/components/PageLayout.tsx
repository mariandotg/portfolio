import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PageLayout = ({ children }: Props) => {
  return (
    <div className='flex flex-col gap-y-[160px] justify-center'>{children}</div>
  );
};

export default PageLayout;
