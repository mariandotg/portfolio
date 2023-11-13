import React from 'react';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';
import ThemeButton from './Buttons/ThemeButton';
import ToTopButton from './Buttons/ToTopButton';
import { getDictionary } from '@/app/[lang]/dictionaries';
import BrandLogo from '../public/public/logo-v2-4.svg';
import Button from './Button';
import { fetchSocialMedia } from '@/services/content/social-media';
import Icon from './icons/Icon';
import NavLogo from './BodyLogoWrapper';
import NavBarWrapper from './NavBarLogo';
import MenuButton from './Buttons/MenuButton/MenuButton';
import LangSelectorMenuItem from './Menus/LangSelectorMenu/LangSelectorMenuItem';
import ThemeToggleInput from './ThemeToggleInput';
import DropdownMenuItem from './Menus/DropdownMenu/DropdownMenuItem';
import MenuLangSelector from './MenuLangSelector';
import DropdownMenuSeparator from './Menus/DropdownMenu/DropdownMenuSeparator';
import NavBarLogo from './NavBarLogo';
import DropdownMenuClose from './Menus/DropdownMenu/DropdownMenuClose';
import Notification from './Notification';
import NavBarClientWrapper from './Toast';
import Toast from './Toast';

interface Props {
  locale: string;
}

interface MenuItem {
  label: {
    en: string;
    es: string;
  };
  value: string;
  icon: string;
  href: string;
}

const NavBar = async ({ locale }: Props) => {
  const constants = await fetchSocialMedia();
  const dict = await getDictionary(locale);
  const newsFlag = { source: `/${locale}/contact`, navigation: 'external' };

  return (
    <>
      <header className='flex-col border-b-[1px] border-light-subtle-edges dark:border-dark-subtle-edges bg-light/80 z-[9999] dark:bg-dark/70 backdrop-saturate-200 fixed top-0 flex items-center w-full backdrop-blur h-fit'>
        <DropdownMenuClose />

        <Notification
          label='Testing new notification flag component :)'
          href={newsFlag}
          variant='warning'
        />
        <nav className='relative flex items-center justify-end w-screen gap-16 px-4 py-3 tablet:max-w-2xl mobile:gap-4'>
          <Link href={`/${locale}`} className='mr-auto'>
            <NavBarLogo />
          </Link>
          <div className='items-center hidden gap-4 mobile:flex dark:text-light'>
            <NavLink href={`/${locale}`}>{dict.routes['/']}</NavLink>
            <NavLink href={`/${locale}/projects`}>
              {dict.routes['/projects']}
            </NavLink>
            <NavLink href={`/${locale}/blog`}>{dict.routes['/blog']}</NavLink>
            <NavLink href={`/${locale}/contact`}>
              {dict.routes['/contact']}
            </NavLink>
          </div>

          <div className='flex'>
            <ThemeButton />
            <MenuButton>
              {constants?.map((item, index) => (
                <DropdownMenuItem key={index} value={item.icon}>
                  <a
                    href={item.url}
                    target='_blank'
                    rel='no-referrer'
                    className='flex w-full h-full gap-x-2 text-secondary'
                  >
                    <Icon value={item.icon} width={18} height={18} />
                    {item.alt}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem key={'3'} value='lang' className='p-0'>
                <MenuLangSelector locale={locale} />
              </DropdownMenuItem>
            </MenuButton>
            <HamburgerMenu locale={locale} dict={dict} />
          </div>
        </nav>
        <Toast />
      </header>
    </>
  );
};

export default NavBar;
