import { PageContentSections } from '../PageContentSections';
import { IPage } from '../contentful/generated/contentful';

export type ContentfulDataAdapter = (data: IPage) => PageContentSections;
