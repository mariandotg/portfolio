import { Metadata } from 'next';
import { getDictionary } from '../dictionaries';

interface Props {
  params: {
    lang: string;
    path: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.project.seoNotFound} - Mariano Guillaume`,
  };
}

export default async function NotFound({ params }: Props) {
  const dict = await getDictionary(params.lang);

  return (
    <div className='flex items-center justify-center w-full h-full'>
      {/*
        No support for metadata in not-found.tsx yet
        https://github.com/vercel/next.js/pull/47328#issuecomment-1488891093
      */}
      <h1 className='mt-20 text-center text-light-headlines dark:text-dark-headlines bg-dark-primary-hover'>
        404 - {dict.project.notFound}
      </h1>
    </div>
  );
}
