'use client';
import useScroll from '@/hooks/useScroll';
import React from 'react';
import { MdKeyboardArrowUp } from 'react-icons/md';
import Button from './Button';

const ToTopButton = () => {
  const { visible, scrollToTop } = useScroll();

  return (
    <Button
      variant='primary'
      onClick={scrollToTop}
      className='flex'
      icon
      disabled={!visible}
      ariaLabel='Scroll to the top'
    >
      <MdKeyboardArrowUp className='duration-[0ms] w-[18px] h-[18px] ' />
    </Button>
  );
};

export default ToTopButton;
