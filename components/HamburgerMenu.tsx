'use client';
import React, { useState } from 'react';
import Button from './Button';
import { MdClose, MdMenu } from 'react-icons/md';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { Dictionary } from '@/app/[lang]/dictionaries';
import Icon from './icons/Icon';

interface Props {
  locale: string;
  dict: Dictionary;
}

interface Link {
  href: string;
}

const menuVariants = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.12, 0, 0.39, 0],
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const mobileLinkVars = {
  initial: {
    y: '30vh',
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
    opacity: 0,
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
    opacity: 1,
  },
};

const containerVars = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
      opacity: 0,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
      opacity: 1,
    },
  },
};

const links: Link[] = [
  {
    href: '/',
  },
  {
    href: '/projects',
  },
  {
    href: '/blog',
  },
];

const HamburgerMenu = ({ locale, dict }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant='primary'
        className='flex mobile:hidden'
        icon
        ariaLabel='Hamburger menu'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <MdClose className='duration-[0ms] w-[18px] h-[18px]' />
        ) : (
          <MdMenu className='duration-[0ms] w-[18px] h-[18px]' />
        )}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute flex mobile:hidden h-screen flex-col justify-center gap-16 origin-top -z-20 w-screen px-6 py-3 left-0 top-0 bg-light dark:bg-dark`}
            variants={menuVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            key='menu-navbar'
          >
            <motion.ul
              className='flex flex-col gap-8'
              variants={containerVars}
              initial='initial'
              animate='open'
              exit='initial'
            >
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center italic font-monospace'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}`} className='text-title'>
                    {dict.routes['/']}
                  </NavLink>
                </motion.div>
              </li>
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center italic font-monospace'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}/projects`} className='text-title'>
                    {dict.routes['/projects']}
                  </NavLink>
                </motion.div>
              </li>
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center italic font-monospace'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}/blog`} className='text-title'>
                    {dict.routes['/blog']}
                  </NavLink>
                </motion.div>
              </li>
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center italic font-monospace'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}/contact`} className='text-title'>
                    {dict.routes['/contact']}
                  </NavLink>
                </motion.div>
              </li>
            </motion.ul>
            <motion.div
              variants={containerVars}
              initial='initial'
              animate='open'
              exit='initial'
            >
              <motion.div
                variants={mobileLinkVars}
                className='flex justify-center gap-2'
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <LangSelector locale={locale} />
                <Button
                  variant='primary'
                  icon
                  ariaLabel='Github'
                  className='ml-2'
                >
                  <Icon value='github' width={18} height={18} />
                </Button>
                <Button variant='primary' icon ariaLabel='Twitter'>
                  <Icon value='twitter' width={18} height={18} />
                </Button>
                <Button variant='primary' icon ariaLabel='LinkedIn'>
                  <Icon value='linkedIn' width={18} height={18} />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
