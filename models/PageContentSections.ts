import {
  AboutContent,
  ProjectsContent,
  SkillsContent,
  JobsContent,
  ArticlesContent,
  ContactContent,
} from '@/models/domain/FormattedData/FormattedContent';
import { FormattedSection } from '@/models/domain/FormattedData/FormattedSection';

export interface PageContentSections {
  about: FormattedSection<AboutContent>;
  featuredProjects: FormattedSection<ProjectsContent>;
  skills: FormattedSection<SkillsContent>;
  jobExperience: FormattedSection<JobsContent>;
  latestArticles: FormattedSection<ArticlesContent>;
  contact: FormattedSection<ContactContent>;
  blog: {
    parent: string;
  };
}
