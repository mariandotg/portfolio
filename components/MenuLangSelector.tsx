'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './icons';
import { LOCALE_CODE } from '@/models/contentful/generated/contentful';
import DropdownMenuContent from './Menus/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from './Menus/DropdownMenu/DropdownMenuItem';

interface Lang {
  label: {
    [key: string]: string;
  };
  value: LOCALE_CODE;
}

interface Props {
  locale: string;
}
const MenuLangSelector = ({ locale }: Props) => {
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

  const handleLangChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prevValue: boolean) => !prevValue);
  };

  const changeLanguage = (e: any, lang: string) => {
    const restPath = path.replace(locale, lang);
    router.push(restPath);
    handleLangChange(e);
  };

  return (
    <div
      className='relative flex flex-col w-full p-2 justify-center select-none z-[9999]'
      onMouseEnter={() => setIsOpen((prev) => !prev)}
      onMouseLeave={() => setIsOpen((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleLangChange(e);
      }}
    >
      <button
        className='flex items-center justify-between w-full not-italic font-medium rounded-sm font-display text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary text-secondary'
        onClick={handleLangChange}
      >
        {currentLanguage?.label[locale]}
        <Icon value={'miniChevronRight'} width={18} height={18} />
      </button>
      <DropdownMenuContent
        isOpen={isOpen}
        menuSize='xl'
        className='absolute w-full left-[calc(100%-8px)] text-light-headlines dark:text-dark-headlines z-[9998] -top-6'
      >
        {langsList.map((item, index) => {
          return (
            <DropdownMenuItem
              key={index}
              value={item.value}
              onClick={(e) => {
                if (item.value !== locale) changeLanguage(e, item.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && item.value !== locale)
                  changeLanguage(e, item.value);
              }}
              disabled={item.value === locale}
            >
              {item.label[locale]}
              {item.value === locale && (
                <Icon value='miniChevronLeft' width={18} height={18} />
              )}
            </DropdownMenuItem>
            // <li
            //   key={index}
            //   value={item.value}
            //   tabIndex={0}
            //   className={`${
            //     item.value === locale
            //       ? 'cursor-not-allowed text-dark-tertiary-pressed'
            //       : 'cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary/80 dark:hover:text-dark-secondary/80'
            //   } flex text-secondary items-center p-2 w-fill`}
            //   onKeyDown={(e) => {
            //     if (e.key === 'Enter' && item.value !== locale)
            //       return changeLanguage(e, item.value);
            //   }}
            //   onClick={(e) => {
            //     if (item.value !== locale) return changeLanguage(e, item.value);
            //   }}
            // >

            // </li>
          );
        })}
      </DropdownMenuContent>
    </div>
  );
};

export default MenuLangSelector;
