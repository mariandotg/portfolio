import { IParagraphFields } from '../contentful/generated/contentful';

export type CtaContactText = Omit<IParagraphFields, 'slug'>;
