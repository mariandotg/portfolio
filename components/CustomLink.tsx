import { ReactNode } from 'react';
import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';

interface Props {
  children: ReactNode;
  href: string;
  icon?: {
    position: 'after' | 'before';
  };
}

// TODO: El icon renderizado debe tener una animación de movimiento
// TODO: Necesito agregar clases semánticas de tailwindcss

const CustomLink = ({
  children,
  href,
  icon = { position: 'after' },
}: Props) => {
  const absoluteUrlPattern = /^(?:https?:\/\/|\/\/)/i;

  const hrefIsAbsolute = absoluteUrlPattern.test(href);

  if (hrefIsAbsolute)
    return (
      <a
        rel='noreferrer'
        target='_blank'
        href={href}
        className='relative flex gap-2 font-medium underline cursor-pointer w-min whitespace-nowrap underline-offset-2 decoration-transparent hover:decoration-primary text-primary h-fit text-secondary'
      >
        {icon && icon.position === 'before' && <MdArrowOutward />}
        {children}
        {icon && icon.position === 'after' && <MdArrowOutward />}
      </a>
    );

  return (
    <Link
      href={href}
      className='relative flex gap-2 font-medium underline cursor-pointer w-min whitespace-nowrap underline-offset-2 decoration-transparent hover:decoration-primary text-primary h-fit text-secondary'
    >
      {icon && icon.position === 'before' && (
        <MdArrowForward className='rotate-180' />
      )}
      {children}
      {icon && icon.position === 'after' && <MdArrowForward />}
    </Link>
  );
};

export default CustomLink;
