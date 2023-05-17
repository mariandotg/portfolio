import { Article } from '../Article';
import { Button } from '../Button';
import { CtaContact } from '../CtaContact';
import { CtaContactText } from '../CtaContactText';
import { Input } from '../Input';
import { JobCard } from '../JobCards';
import { Project } from '../Project';
import { SkillCard } from '../SkillCard';

export interface AboutContent {
  description: {
    text: string;
  };
  secondaryCta: Button;
  cta: Button;
}

export interface ProjectsContent {
  projects: Array<Project>;
}

export interface SkillsContent {
  skillsDescription: {
    text: string;
  };
  skillCards: Array<SkillCard>;
}

export interface JobsContent {
  jobCards: Array<JobCard>;
}

export interface ArticlesContent {
  articles: Array<Article>;
}

export interface ContactContent {
  ctaContact: CtaContact;
  ctaContactText: CtaContactText;
  contactForm: Array<Input>;
  sendMail: Button;
}
