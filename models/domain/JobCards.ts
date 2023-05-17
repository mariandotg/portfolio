import { IJobCardFields } from '../contentful/generated/contentful';

export interface JobCard extends Omit<IJobCardFields, 'slug'> {
  id: string;
}
