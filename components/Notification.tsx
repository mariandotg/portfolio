import React from 'react';
import { Icon } from './icons';
import Link from 'next/link';

export interface Flag {
  icon?: string;
  label: string;
  href?: {
    source: string;
    navigation: string;
  };
  variant: 'warning' | 'error' | 'success';
}

const Notification = ({ icon, label, href, variant }: Flag) => {
  const variants = {
    warning: 'bg-warning',
    error: 'bg-error',
    success: 'bg-success',
  };

  if (!href)
    return (
      <div
        className={`flex items-center justify-center w-screen h-5 font-medium ${variants[variant]} text-dark dark:text-light text-secondary gap-x-1`}
      >
        {icon && <Icon value={icon} width={16} height={16} />}
        {label}
      </div>
    );

  if (href.navigation !== 'internal')
    return (
      <Link
        className={`flex items-center justify-center w-screen h-5 font-medium bg-${variant} text-dark dark:text-light text-secondary gap-x-1`}
        href={href.source}
      >
        {icon && <Icon value={icon} width={16} height={16} />}
        {label}
      </Link>
    );
  else {
    return (
      <a
        className={`flex items-center justify-center w-screen h-5 font-medium bg-${variant} text-dark dark:text-light text-secondary gap-x-1`}
        href={href.source}
        rel='noreferrer'
        target='_blank'
      >
        {icon && <Icon value={icon} width={16} height={16} />}
        {label}
      </a>
    );
  }
};

export default Notification;
