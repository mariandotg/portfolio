'use client';
import React from 'react';
import { motion } from 'framer-motion';

const CursorBlob = () => {
  const blobRef = React.useRef<HTMLDivElement>(null);

  // Device has a mouse
  const handleMouseMove = (event: MouseEvent) => {
    if (matchMedia('(pointer:fine)').matches) {
      console.log('tiene mouse');
      const y = event.clientY;
      const x = event.clientX;

      blobRef.current!.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    } else {
      console.log('NO tiene mouse');
      blobRef.current!.animate(
        {
          left: `50%`,
          top: `50%`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    }
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={blobRef}
        className='rounded-full left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 h-[150px] tablet:h-[200px] bg-gradient-to-r dark:from-primary dark:to-70% dark:to-[#231040] from-[#7300ff] to-[#3118f0] aspect-square cursor-gradient fixed -z-[9999]'
      ></div>
      <div className='fixed top-0 left-0 h-screen w-screen -z-[9998] gradient-backdrop backdrop-saturate-200'></div>
    </>
  );
};

export default CursorBlob;
