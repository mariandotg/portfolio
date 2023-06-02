import { Date } from './Date';
import { Tag } from './Tag';

export interface Article {
  id: string;
  path: string;
  date: Date;
  image: string;
  imageAlt: string;
  tags: Array<Tag>;
  name: string;
  description: string;
}
