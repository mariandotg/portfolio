'use client';
import { useState } from 'react';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardArrowLeft,
} from 'react-icons/md';
import { usePathname, useRouter } from 'next/navigation';

import { LOCALE_CODE } from '@/models/contentful/generated/contentful';

import Button from './Button';

interface Lang {
  label: {
    [key: string]: string;
  };
  value: LOCALE_CODE;
}

interface Props {
  locale: string;
}

const LangSelector = ({ locale }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const langsList: Array<Lang> = [
    {
      label: {
        en: 'Spanish',
        es: 'Español',
      },
      value: 'es',
    },
    {
      label: {
        en: 'English',
        es: 'Inglés',
      },
      value: 'en',
    },
  ];

  const currentLanguage = langsList.find((item) => item.value === locale);

  const handleLangChange = () => {
    setIsOpen((prevValue: boolean) => !prevValue);
  };

  const changeLanguage = (lang: string) => {
    const restPath = path.replace(locale, lang);
    router.push(restPath);
    handleLangChange();
  };

  return (
    <div className='relative flex flex-col justify-center select-none'>
      <button
        className='flex items-center justify-between h-8 px-2 py-1 pr-1 not-italic font-medium border rounded-sm w-[88px] hover:bg-dark-tertiary-pressed/20 hover:dark:bg-light-tertiary-pressed/50 font-display border-light-subtle-edges dark:border-dark-subtle-edges text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary text-secondary'
        onClick={handleLangChange}
      >
        {currentLanguage?.label[locale]}
        {!isOpen ? (
          <MdKeyboardArrowDown className='w-[18px] h-[18px]' />
        ) : (
          <MdKeyboardArrowUp className='w-[18px] h-[18px]' />
        )}
      </button>
      <div className='absolute right-0 w-full top-full text-light-headlines dark:text-dark-headlines'>
        {isOpen && (
          <ul className='z-20 my-1 text-right w-full rounded-sm bg-light dark:bg-dark border-[1px] border-dark-tertiary-pressed/20 dark:border-light-tertiary-pressed/50'>
            {langsList.map((item, index) => {
              return (
                <li
                  key={index}
                  value={item.value}
                  tabIndex={0}
                  className={`${
                    item.value === locale
                      ? 'cursor-not-allowed text-dark-tertiary-pressed'
                      : 'cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary/80 dark:hover:text-dark-secondary/80'
                  } flex text-secondary items-center p-2 w-fill`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && item.value !== locale)
                      return changeLanguage(item.value);
                  }}
                  onClick={() => {
                    if (item.value !== locale)
                      return changeLanguage(item.value);
                  }}
                >
                  {item.label[locale]}
                  {item.value === locale && (
                    <MdKeyboardArrowLeft className='w-[18px] h-[18px]' />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LangSelector;
