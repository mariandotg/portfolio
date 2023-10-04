'use client';
import { ReactNode } from 'react';
import { motion, useScroll } from 'framer-motion';
interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className='flex flex-col gap-y-4 tablet:grid tablet:gap-4 tablet:grid-cols-4'
    >
      {children}
    </motion.section>
  );
};

export default Section;
