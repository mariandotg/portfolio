import { ReactNode } from 'react';

import { Button as ButtonModel } from '@/models/domain/Button';
import Emoji from './Emoji';

interface Props {
  children: ReactNode;
  emoji?: string;
}

const SectionTitle = ({ children, emoji }: Props) => {
  return (
    <div className='flex justify-between tablet:col-span-3'>
      <h2
        className={`flex italic font-medium items-center after:content-[""] after:h-[1px] after:grow w-full after:bg-primary dark:text-dark-headlines gap-x-4 font-monospace text-light-headlines`}
      >
        <Emoji emoji={emoji} width={20} height={20} />
        {children}
      </h2>
    </div>
  );
};

export default SectionTitle;
