'use client';
import { useContext, useRef, useEffect } from 'react';
import BrandLogo from '../public/public/logo-v2-4.svg';
import { LogoContext } from '@/lib/Context';

const NavLogo = () => {
  const { setShowLogo } = useContext(LogoContext);

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

  return (
    <div ref={cardRef}>
      <BrandLogo
        className='flex tablet:dark:flex w-[164px] fill-dark dark:fill-light group-hover:fill-primary sticky mr-auto'
        alt='brand marianoGuillaume logo'
      />
    </div>
  );
};

export default NavLogo;
