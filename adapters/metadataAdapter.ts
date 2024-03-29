import { Meta } from '@/models/blog/blog.models';
import { Metadata } from 'next';

export const metadataAdapter = (seoObject: Meta): Metadata => {
  return {
    title: seoObject.title,
    category: 'technology',
    description: seoObject.description,
    twitter: {
      card: 'summary_large_image',
      site: '@site',
      creator: '@creator',
      images: {
        url: seoObject.image,
        alt: seoObject.imageAlt,
      },
    },
    openGraph: {
      title: seoObject.title,
      description: seoObject.description,
      url: seoObject.url,
      siteName: seoObject.title,
      type: 'website',
      images: [
        {
          url: seoObject.image,
          alt: seoObject.imageAlt,
        },
      ],
    },
  };
};
