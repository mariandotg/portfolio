import Image from 'next/image';
import React from 'react';
import PageLayout from '../../components/PageLayout';

const BlogPage = () => {
  return (
    <PageLayout>
      <div className='flex flex-col gap-8'>
        <div className='relative h-64'>
          <Image
            src='/header-web.webp'
            alt='page header'
            className='absolute object-cover'
            fill={true}
            priority
            quality={90}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPage;
