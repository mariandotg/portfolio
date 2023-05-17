import { IButtonFields } from '../contentful/generated/contentful';

export type Button = Omit<IButtonFields, 'slug'>;
