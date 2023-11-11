'use client';
import { useContext, useRef, useEffect, ReactNode } from 'react';
import { NavBarContext } from '@/lib/NavBarContext';

interface Props {
  children: ReactNode;
}

const BodyLogoWrapper = ({ children }: Props) => {
  const { setShowLogo } = useContext(NavBarContext);

  const cardRef = useRef(null);

  const callBack = (entries: any) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      console.log('intersecting');
      setShowLogo(false);
    } else {
      console.log('NOT intersecting');
      setShowLogo(true);
    }
  };

  const options = {
    root: null,
    rootMargin: '-32px',
    threshold: 0.75,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callBack, options);

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return <div ref={cardRef}>{children}</div>;
};

export default BodyLogoWrapper;
