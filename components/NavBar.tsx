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
import NavBarWrapper from './NavBarWrapper';
import MenuButton from './Buttons/MenuButton/MenuButton';
import LangSelectorMenuItem from './Menus/LangSelectorMenu/LangSelectorMenuItem';
import ThemeToggleInput from './ThemeToggleInput';
import DropdownMenuItem from './Menus/DropdownMenu/DropdownMenuItem';
import MenuLangSelector from './MenuLangSelector';
import DropdownMenuSeparator from './Menus/DropdownMenu/DropdownMenuSeparator';
import NavBarLogo from './NavBarWrapper';
import DropdownMenuClose from './Menus/DropdownMenu/DropdownMenuClose';

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

  const navMenuList: MenuItem[] = [
    {
      label: {
        en: 'Github',
        es: 'Github es',
      },
      value: 'github',
      icon: 'github',
      href: 'https://github.com/Upward-Solutions/liquidator',
    },
  ];
  console.log(constants);
  return (
    <header className='border-b-[1px] border-light-subtle-edges dark:border-dark-subtle-edges bg-light/80 z-[9999] dark:bg-dark/70 backdrop-saturate-200 fixed top-0 flex justify-center w-full backdrop-blur h-[57px]'>
      <DropdownMenuClose />
      <nav className='relative flex items-center justify-end w-screen gap-16 px-4 py-3 tablet:max-w-2xl mobile:gap-4'>
        {/* <Link
          href={`/${locale}`}
          className='absolute flex items-center h-full -translate-x-1/2 left-2/4 w-fit group'
        >
          <BrandLogo
            className='flex mobile:hidden tablet:dark:flex tablet:flex w-[164px] fill-dark dark:fill-light group-hover:fill-primary'
            alt='brand marianoGuillaume logo'
          />
          <Image
            src='/public/mdg.svg'
            alt='brand mdg logo'
            className='hidden mobile:flex left-2/4 tablet:hidden dark:brightness-[200]'
            width={50}
            height={23}
          />
        </Link> */}
        <NavBarLogo />
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
        {/* <div className='relative flex items-center gap-0'>
          <div className='hidden mobile:flex'>
            <LangSelector locale={locale} />
            <div className='flex ml-2'>
              {constants!.map((social) => (
                <Button
                  variant='primary'
                  icon
                  url={social.url}
                  key={social.id}
                  ariaLabel={social.alt}
                  className='text-light-headlines dark:text-dark-headlines'
                >
                  <Icon value={social.icon} width={18} height={18} />
                </Button>
              ))}
            </div>
          </div>
          <ThemeButton />
          <ToTopButton />
        </div> */}
      </nav>
    </header>
  );
};

export default NavBar;
