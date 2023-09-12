import { fetchProjects } from '@/services/content/projects';
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
  const projects = await fetchProjects(params.lang);
  const featuredProjects = projects?.slice(0, 2);

  const projectCardsStyles: ProjectCardsStyles = {
    '0': 'tablet:col-span-1 tablet:row-span-1',
    '1': 'tablet:col-span-2 tablet:row-span-2',
    '2': 'tablet:col-span-1 tablet:row-span-1',
    '3': 'tablet:col-span-1 tablet:row-span-1 tablet:h-[256px]',
  };

  return featuredProjects!.map((project, index) => (
    <ProjectCard
      key={project.id}
      project={project}
      locale={params.lang}
      featured={true}
    />
  ));
};

export default FeaturedProjects;
