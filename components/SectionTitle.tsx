import { ReactNode } from 'react';
import Emoji from './Emoji';
import CustomLink from './CustomLink';

export interface AdditionalLink {
  href: string;
  label: string;
}

interface Props {
  children: ReactNode;
  emoji?: string;
  additionalLink?: AdditionalLink;
}

const SectionTitle = ({ children, emoji, additionalLink }: Props) => {
  return (
    <div className='flex items-end justify-between tablet:col-span-4 text-light-headlines dark:text-dark-headlines'>
      <h2 className='flex items-center w-full font-medium text-article font-display gap-x-4 '>
        {/* {emoji && <Emoji emoji={emoji} width={20} height={20} />} */}
        {children}
      </h2>
      {additionalLink && (
        <CustomLink href={additionalLink.href}>
          {additionalLink.label}
        </CustomLink>
      )}
    </div>
  );
};

export default SectionTitle;
