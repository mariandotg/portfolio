import { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  href: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
}

// TODO: El icon renderizado debe tener una animación de movimiento
// TODO: Necesito agregar clases semánticas de tailwindcss

const LinkButton = ({
  children,
  href,
  startContent,
  endContent,
  className,
}: Props) => {
  const absoluteUrlPattern = /^(?:https?:\/\/|\/\/)/i;

  const hrefIsAbsolute = absoluteUrlPattern.test(href);

  if (hrefIsAbsolute)
    return (
      <a
        rel='noreferrer'
        target='_blank'
        href={href}
        className={`flex items-center justify-center gap-2 px-4 py-2 border border-transparent hover:border-primary rounded-[2px] bg-primary/10 text-primary ${
          startContent && 'pl-3'
        } ${endContent && 'pr-3'} font-medium duration-200 ${className}`}
      >
        {startContent && startContent}
        {children}
        {endContent && endContent}
      </a>
    );

  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-2 px-6 py-3 border border-transparent hover:border-primary rounded-[2px] bg-primary/10 text-primary ${
        startContent && 'pl-4'
      } ${endContent && 'pr-4'} font-medium duration-200 ${className}`}
    >
      {startContent && startContent}
      {children}
      {endContent && endContent}
    </Link>
  );
};

export default LinkButton;
