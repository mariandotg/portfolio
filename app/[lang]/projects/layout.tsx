import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

const ProjectsLayout = ({ children }: Props) => {
  return children;
};

export default ProjectsLayout;
