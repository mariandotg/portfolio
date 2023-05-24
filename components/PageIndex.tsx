'use client';
import React, { useEffect, useRef, useState } from 'react';

const PageIndex = () => {
  const headingsWithIdsRef = useRef<Element[]>([]);
  const navbarHeight = 64;
  const [headingsWithIds, setHeadingsWithIds] = useState<Element[]>([]);

  useEffect(() => {
    const headingsWithIds = Array.from(document.querySelectorAll('h2[id]'));
    setHeadingsWithIds(headingsWithIds);
    headingsWithIdsRef.current = headingsWithIds;
  }, []);

  const scrollToHeading = (index: number) => {
    const heading = headingsWithIdsRef.current[index];
    if (heading instanceof HTMLElement) {
      const topOffset = heading.offsetTop - navbarHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-col col-span-1 gap-y-2'>
      {headingsWithIds.map((heading, index) => (
        <span
          key={index}
          className='italic font-medium underline cursor-pointer text-secondary font-monospace text-primary underline-offset-2 w-fit'
          onClick={() => scrollToHeading(index)}
        >
          {heading.textContent}
        </span>
      ))}
    </div>
  );
};

export default PageIndex;
