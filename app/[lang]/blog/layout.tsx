import React from 'react';
import { Metadata } from 'next';
import { PageSeo } from '@/models/PageSeo';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Article } from '@/models/domain/Article';

interface Props {
  params: {
    path: string;
  };
}

interface ArticleData {
  markdown: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  metadata: Article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleFetch = await fetch(
    `${process.env.BASE_FETCH_URL}/en/api/articles/blog`
  );

  const articleResponse: ArticleData = await articleFetch.json();

  return metadataAdapter(articleResponse.seo);
}

const BlogLayout = ({
  children,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) => {
  return children;
};

export default BlogLayout;
