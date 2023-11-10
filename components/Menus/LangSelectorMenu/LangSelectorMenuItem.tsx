'use client';
import React, { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Lang } from './LangSelectorMenu';
import { Icon } from '@/components/icons';

interface Props {
  item: Lang;
  locale: string;
  children: ReactNode;
}

const LangSelectorMenuItem = ({ item, locale, children }: Props) => {
  const router = useRouter();
  const path = usePathname();

  const changeLanguage = (currentLocale: string, newLocale: string) => {
    const restPath = path.replace(currentLocale, newLocale);
    router.push(restPath);
  };

  return (
    <li
      value={item.value}
      tabIndex={0}
      className={`${
        item.value === locale
          ? 'cursor-not-allowed text-dark-tertiary-pressed'
          : 'cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary/80 dark:hover:text-dark-secondary/80'
      } flex text-secondary items-center p-2 w-fill`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && item.value !== locale)
          return changeLanguage(locale, item.value);
      }}
      onClick={(e) => {
        if (item.value !== locale) return changeLanguage(locale, item.value);
      }}
    >
      {children}
      {item.value === locale && (
        <Icon value='miniChevronLeft' width={18} height={18} />
      )}
    </li>
  );
};

export default LangSelectorMenuItem;
