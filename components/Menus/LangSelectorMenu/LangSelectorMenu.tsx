import { Icon } from '@/components/icons';
import { LOCALE_CODE } from '@/models/contentful/generated/contentful';
import React from 'react';

export interface Lang {
  label: {
    [key: string]: string;
  };
  value: LOCALE_CODE;
}

interface Props {
  locale: string;
}

export const langsList: Array<Lang> = [
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

const LangSelectorMenu = ({ locale }: Props) => {
  return (
    <ul className='z-20 my-1 text-right w-full rounded-sm bg-light dark:bg-dark border-[1px] border-light-subtle-edges dark:border-dark-subtle-edges'>
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
          >
            {item.label[locale]}
            {item.value === locale && (
              <Icon value='miniChevronLeft' width={18} height={18} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default LangSelectorMenu;
