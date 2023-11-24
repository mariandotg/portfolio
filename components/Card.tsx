import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  as: React.ElementType<{
    className?: string;
  }>;
}

const Card = ({ as: Component, className, ...props }: Props) => {
  return (
    <Component
      {...props}
      className={`p-4 border rounded-sm border-light-subtle-edges dark:border-dark-subtle-edges flex flex-col gap-y-2 min-h-32 hover:bg-[#f8f8fa] dark:hover:bg-[#0E0E0F] hover:border-primary dark:hover:border-primary ${className}`}
    />
  );
};

export default Card;
