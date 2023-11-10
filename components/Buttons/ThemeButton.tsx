'use client';
import useIsMounted from '@/hooks/useIsMounted';
import useTheme from '@/hooks/useTheme';
import { FaSpinner } from 'react-icons/fa';
import Button from '../Button';
import Icon from '../icons/Icon';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const isMounted = useIsMounted();

  const icon = theme === 'dark' ? 'solidLightTheme' : 'solidDarkTheme';
  return (
    <Button
      variant='primary'
      onClick={toggleTheme}
      icon
      disabled={!isMounted}
      ariaLabel='Change theme'
      className='text-light-headlines dark:text-dark-headlines'
    >
      {isMounted ? (
        <Icon value={icon} width={18} height={18} />
      ) : (
        <FaSpinner className='duration-[0ms] w-[18px] h-[18px]' />
      )}
    </Button>
  );
};

export default ThemeButton;
