'use client';
import useTheme from '@/hooks/useTheme';
import React, { useState } from 'react';
import { Icon } from './icons';

const ThemeToggleInput = () => {
  const { theme, toggleTheme } = useTheme();
  const icon = theme === 'dark' ? 'solidLightTheme' : 'solidDarkTheme';
  const contraryIcon = theme !== 'dark' ? 'solidLightTheme' : 'solidDarkTheme';
  const [enabled, setEnabled] = useState(true);

  return (
    <label className='relative inline-flex h-[18px] items-center justify-center gap-2 mr-5 cursor-pointer'>
      <Icon value={contraryIcon} width={18} height={18} />
      <div className='relative'>
        <input
          id='toogleA'
          type='checkbox'
          className='sr-only'
          checked={enabled}
          onClick={() => {
            setEnabled((prev) => !prev);
            toggleTheme();
          }}
        />
        <div className='w-10 h-4 rounded-sm shadow-inner bg-dark-tertiary-pressed'></div>
        <div className='absolute w-6 h-6 transition rounded-full shadow dot bg-light -left-1 -top-1'></div>
      </div>
      <Icon value={icon} width={18} height={18} />
    </label>
  );
};

export default ThemeToggleInput;
