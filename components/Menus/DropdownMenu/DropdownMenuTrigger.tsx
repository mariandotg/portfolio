import Button from '@/components/Button';
import { Icon } from '@/components/icons';
import { ReactNode, useState } from 'react';

interface Label {
  open: string;
  closed: string;
}

interface Props {
  label?: Label;
  icon?: boolean;
  children?: ReactNode;
  isOpen: boolean;
  onClick: (e: any) => void;
}

const DropdownMenuTrigger = ({
  label,
  icon,
  children,
  isOpen,
  onClick,
}: Props) => {
  return !icon ? (
    <button
      className='flex items-center justify-between w-24 h-8 px-2 py-1 pr-1 not-italic font-medium border rounded-sm hover:bg-dark-tertiary-pressed/20 hover:dark:bg-light-tertiary-pressed/50 font-display border-light-subtle-edges dark:border-dark-subtle-edges text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary text-secondary'
      onClick={onClick}
    >
      {label ? (isOpen ? label.open : label.closed) : children}
      <Icon
        value={isOpen ? 'miniChevronUp' : 'miniChevronDown'}
        width={18}
        height={18}
      />
    </button>
  ) : (
    <Button
      variant='primary'
      onClick={onClick}
      icon
      className='text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary '
    >
      <Icon value={isOpen ? 'closeMenu' : 'menu'} width={18} height={18} />
    </Button>
  );
};

export default DropdownMenuTrigger;
