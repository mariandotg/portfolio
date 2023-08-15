'use client';
import { useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp, MdLanguage } from 'react-icons/md';
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
    <div className='flex flex-col justify-center select-none'>
      <Button
        variant='tertiary'
        className='flex items-center h-8 gap-2 not-italic'
        onClick={handleLangChange}
        icon
      >
        {locale.toUpperCase()}
        {!isOpen ? (
          <MdArrowDropDown className='w-[18px] h-[18px]' />
        ) : (
          <MdArrowDropUp className='w-[18px] h-[18px]' />
        )}
      </Button>
      <div className='relative w-full text-light-headlines dark:text-dark-headlines'>
        {isOpen && (
          <ul className='absolute top-2 z-20 text-right w-full rounded bg-light dark:bg-dark border-[1px] border-primary'>
            {langsList.map((item, index) => {
              return (
                <li
                  key={index}
                  value={item.value}
                  tabIndex={0}
                  className={`${
                    item.value === locale
                      ? 'cursor-not-allowed text-dark-tertiary-pressed'
                      : 'cursor-pointer text-light-headlines dark:text-dark-headlines dark:hover:text-dark-primary-hover hover:text-light-primary-hover'
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
