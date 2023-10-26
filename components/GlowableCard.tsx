'use client';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const GlowableCard = ({ children, className }: Props) => {
  //@ts-ignore
  const handleOnMouseMove = (e) => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
    console.log({ x, y });
  };

  return (
    <div
      className={`rounded relative group shadow-dark-primary-hover hover:shadow-lg before:content-[""] before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-[2] glowable-card before:rounded before:opacity-0 before:duration-500 hover:before:opacity-100 bg-light-subtle-edges dark:bg-dark-subtle-edges ${className}`}
      onMouseMove={(e) => handleOnMouseMove(e)}
    >
      <div className='card-border z-[1] opacity-0 group-hover:opacity-100 absolute top-0 left-0 h-full w-full rounded duration-500'></div>
      <div className='p-4 h-[calc(100%-2px)] w-[calc(100%-2px)] rounded m-[1px] bg-light/80 relative dark:bg-dark/80 flex flex-col gap-y-2 mobile:col-span-1 z-[3]'>
        {children}
      </div>
    </div>
  );
};

export default GlowableCard;
