import { IHeadlineFields } from '../contentful/generated/contentful';

interface TextProperty extends Omit<IHeadlineFields, 'slug'> {
  id: string;
}

export interface Text {
  [key: string]: TextProperty;
}
