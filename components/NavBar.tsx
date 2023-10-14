import React from 'react';
import Image from 'next/image';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';
import ThemeButton from './ThemeButton';
import ToTopButton from './ToTopButton';
import { getDictionary } from '@/app/[lang]/dictionaries';
import BrandLogo from '../public/public/logo-v2-4.svg';
import Button from './Button';
import { fetchSocialMedia } from '@/services/content/social-media';
import Icon from './Icon';
interface Props {
  locale: string;
}

const NavBar = async ({ locale }: Props) => {
  const constants = await fetchSocialMedia();

  const dict = await getDictionary(locale);

  return (
    <header className='border-b-[1px] border-light-subtle-edges dark:border-dark-subtle-edges bg-light/80 z-[9999] dark:bg-dark/70 backdrop-saturate-200 fixed top-0 flex justify-center w-full backdrop-blur'>
      <nav className='relative px-4 py-3 flex items-center w-screen tablet:max-w-[1440px] justify-between gap-16 mobile:gap-4'>
        <Link
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
        </Link>
        <div className='items-center hidden gap-4 mobile:flex dark:text-light'>
          <NavLink href={`/${locale}`}>{dict.routes['/']}</NavLink>
          <NavLink href={`/${locale}/projects`}>
            {dict.routes['/projects']}
          </NavLink>
          <NavLink href={`/${locale}/blog`}>{dict.routes['/blog']}</NavLink>
        </div>
        <HamburgerMenu locale={locale} />
        <div className='relative flex items-center gap-0'>
          <div className='hidden mobile:flex'>
            <LangSelector locale={locale} />
            <div className='ml-2 flex'>
              {constants!.map((social) => (
                <Button
                  variant='primary'
                  icon
                  url={social.url}
                  key={social.id}
                  ariaLabel={social.alt}
                >
                  <Icon value={social.icon.toLocaleLowerCase()} />
                </Button>
              ))}
            </div>
          </div>
          <ThemeButton />
          <ToTopButton />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
