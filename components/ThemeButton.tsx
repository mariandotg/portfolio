'use client';
import useIsMounted from '@/hooks/useIsMounted';
import useTheme from '@/hooks/useTheme';
import { FaSpinner } from 'react-icons/fa';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import Button from './Button';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isMounted = useIsMounted();

  return (
    <Button
      variant='primary'
      onClick={toggleTheme}
      icon
      disabled={!isMounted}
      ariaLabel='Change theme'
    >
      {isMounted ? (
        theme === 'dark' ? (
          <MdLightMode className='duration-[0ms] w-[18px] h-[18px]' />
        ) : (
          <MdDarkMode className='duration-[0ms] w-[18px] h-[18px]' />
        )
      ) : (
        <FaSpinner className='duration-[0ms] w-[18px] h-[18px]' />
      )}
    </Button>
  );
};

export default ThemeButton;
