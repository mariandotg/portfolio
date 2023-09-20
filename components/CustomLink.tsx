import { ReactNode } from 'react';
import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';

interface Props {
  children: ReactNode;
  href: string;
}

// TODO: El icon renderizado debe tener una animación de movimiento
// TODO: Necesito agregar clases semánticas de tailwindcss

const CustomLink = ({ children, href }: Props) => {
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
        {children}
        <MdArrowOutward />
      </a>
    );

  return (
    <Link
      href={href}
      className='relative flex gap-2 font-medium underline cursor-pointer w-min whitespace-nowrap underline-offset-2 decoration-transparent hover:decoration-primary text-primary h-fit text-secondary'
    >
      {children}
      <MdArrowForward />
    </Link>
  );
};

export default CustomLink;
