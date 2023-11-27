import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

const BlogLayout = ({ children }: Props) => {
  return children;
};

export default BlogLayout;
