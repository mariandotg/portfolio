import React from 'react';
import { Metadata } from 'next';
import { pageSeoAdapter } from '@/adapters/pageSeoAdapter';
import { queryNotionDatabase } from '@/services/notion';

interface Props {
  params: {
    path: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const seoResponse = await queryNotionDatabase({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: params.path,
        },
      },
    },
  });

  const seo = pageSeoAdapter(seoResponse[0]);

  return {
    title: seo.title,
    category: 'technology',
    description: seo.description,
    twitter: {
      card: 'summary_large_image',
      site: '@site',
      creator: '@creator',
      images: {
        url: seo.image,
        alt: seo.imageAlt,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.title,
      type: 'website',
      images: [
        {
          url: seo.image,
          alt: seo.imageAlt,
        },
      ],
    },
  };
}

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) => {
  return children;
};

export default ProjectLayout;
