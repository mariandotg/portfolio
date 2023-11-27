import { IInputFields } from '../contentful/generated/contentful';

export interface Input extends Omit<IInputFields, 'slug'> {
  id: string;
}
