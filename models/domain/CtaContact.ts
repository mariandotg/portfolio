import { IHeadlineFields } from '../contentful/generated/contentful';

export type CtaContact = Omit<IHeadlineFields, 'slug'>;
