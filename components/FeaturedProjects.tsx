import { Project } from '@/models/domain/Project';
import ProjectCard from './ProjectCard';

interface Props {
  params: {
    lang: string;
    path?: string;
  };
}

interface ProjectCardsStyles {
  [index: number]: string;
}

const FeaturedProjects = async ({ params }: Props) => {
  const projectsFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects/featured`,
    { cache: 'force-cache' }
  );

  const data: Project[] = await projectsFetch.json();

  const projectCardsStyles: ProjectCardsStyles = {
    '0': 'tablet:col-span-1 tablet:row-span-1',
    '1': 'tablet:col-span-2 tablet:row-span-2',
    '2': 'tablet:col-span-1 tablet:row-span-1',
    '3': 'tablet:col-span-1 tablet:row-span-1 tablet:h-[256px]',
  };

  return data.map((project, index) => (
    <ProjectCard
      key={project.id}
      project={project}
      locale={params.lang}
      className={projectCardsStyles[index]}
      featured={true}
    />
  ));
};

export default FeaturedProjects;
