import { ISkillsCardFields } from '../contentful/generated/contentful';

export interface SkillCard extends Omit<ISkillsCardFields, 'slug'> {
  id: string;
}
