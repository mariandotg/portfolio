'use client';
import { useRef, useState, useEffect } from 'react';

const PageIndexes = () => {
  const headingsWithIdsRef = useRef<Element[]>([]);
  const [headingsWithIds, setHeadingsWithIds] = useState<Element[]>([]);

  useEffect(() => {
    const headingsWithIds = Array.from(document.querySelectorAll('h2[id]'));
    setHeadingsWithIds(headingsWithIds);
    headingsWithIdsRef.current = headingsWithIds;
  }, []);

  return (
    <>
      {headingsWithIds.map((heading, index) => (
        <a
          key={index}
          className='italic font-medium underline cursor-pointer text-secondary font-monospace text-primary underline-offset-2 w-fit'
          href={`#${headingsWithIds[index].id}`}
        >
          {heading.textContent}
        </a>
      ))}
    </>
  );
};

export default PageIndexes;
