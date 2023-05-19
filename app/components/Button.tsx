'use client';
import { ReactNode } from 'react';

interface Props {
  variant: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
  icon?: boolean;
  onClick?: () => void;
  className?: string;
  url?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button = ({
  onClick,
  children,
  className,
  variant,
  url,
  icon,
  disabled,
  ariaLabel,
}: Props) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
  };
  const styles = `${variants[variant]} ${className ? className : ''} ${
    icon ? 'p-[6px] w-fit rounded-[8px]' : 'px-6 py-3 w-full'
  } border italic text-center ${
    disabled && 'disabled:opacity-30 disabled:pointer-events-none'
  } flex items-center justify-center gap-2 text-secondary whitespace-nowrap transition rounded font-monospace`;

  if (url) {
    return (
      <a
        className={styles}
        onClick={onClick}
        href={url}
        target='_blank'
        rel='noreferrer'
      >
        {children}
      </a>
    );
  } else {
    return (
      <button
        className={styles}
        onClick={onClick}
        disabled={disabled}
        aria-label={icon ? ariaLabel : undefined}
      >
        {children}
      </button>
    );
  }
};

export default Button;
