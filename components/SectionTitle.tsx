import { ReactNode } from 'react';
import Emoji from './Emoji';

interface Props {
  children: ReactNode;
  emoji?: string;
}

const SectionTitle = ({ children, emoji }: Props) => {
  return (
    <div className='flex justify-between tablet:col-span-3'>
      <h2 className='flex items-center w-full italic font-medium font-monospace dark:text-dark-headlines gap-x-4 text-light-headlines'>
        <Emoji emoji={emoji} width={20} height={20} />
        {children}
      </h2>
    </div>
  );
};

export default SectionTitle;
