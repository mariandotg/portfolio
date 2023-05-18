import Image from 'next/image';
import PageLayout from './components/PageLayout';
import AboutSection from './components/AboutSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';

const HomePage = async () => {
  return (
    <>
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
      <PageLayout>
        // {/* @ts-expect-error Async Server Component */}
        <AboutSection />
        // {/* @ts-expect-error Async Server Component */}
        <FeaturedProjectsSection />
      </PageLayout>
    </>
  );
};

export default HomePage;
