import { Tag } from './Tag';

export interface Project {
  id: string;
  path: string;
  image: string;
  imageAlt: string;
  tags: Array<Tag>;
  name: string;
  description: string;
  repository: string;
  live: string;
}
