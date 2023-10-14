'use client';
import React, { useState } from 'react';
import Button from './Button';
import { MdClose, MdMenu } from 'react-icons/md';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import ThemeButton from './ThemeButton';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  locale: string;
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
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
  },
};

const containerVars = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
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

const HamburgerMenu = ({ locale }: Props) => {
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
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            className={`absolute flex mobile:hidden h-screen flex-col justify-center gap-16 origin-top -z-20 w-screen px-6 py-3 left-0 top-0 bg-light dark:bg-dark`}
            variants={menuVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            key='menu-navbar'
            transition={{
              duration: 0.5,
              ease: [0.12, 0, 0.39, 0],
            }}
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
                  className='flex justify-center font-monospace italic'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}`} className='text-title'>
                    Portfolio
                  </NavLink>
                </motion.div>
              </li>
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center font-monospace italic'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}/projects`} className='text-title'>
                    Proyectos
                  </NavLink>
                </motion.div>
              </li>
              <li className='overflow-hidden'>
                <motion.div
                  variants={mobileLinkVars}
                  className='flex justify-center font-monospace italic'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <NavLink href={`/${locale}/blog`} className='text-title'>
                    Blog
                  </NavLink>
                </motion.div>
              </li>
            </motion.ul>
            <motion.div
              className='overflow-hidden'
              variants={containerVars}
              initial='initial'
              animate='open'
              exit='initial'
            >
              <motion.div
                variants={mobileLinkVars}
                className='flex gap-4 justify-center'
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <LangSelector locale={locale} />
                <Button variant='primary' icon ariaLabel='test 1'>
                  <FaGithub />
                </Button>
                <Button variant='primary' icon ariaLabel='test 1'>
                  <FaTwitter />
                </Button>
                <Button variant='primary' icon ariaLabel='test 1'>
                  <FaLinkedin />
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
