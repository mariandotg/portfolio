'use client';
import useScroll from '@/hooks/useScroll';
import React from 'react';
import Button from '../Button';
import Icon from '../icons/Icon';

const ToTopButton = () => {
  const { visible, scrollToTop } = useScroll();

  return (
    <Button
      variant='primary'
      onClick={scrollToTop}
      icon
      disabled={!visible}
      ariaLabel='Scroll to the top'
      className='flex text-light-headlines dark:text-dark-headlines'
    >
      <Icon value='outlineChevronUp' width={18} height={18} />
    </Button>
  );
};

export default ToTopButton;
