import { IPage } from '../contentful/generated/contentful';
import { PageContentSections } from '../store/state/PageContentSections';

export type ContentfulDataAdapter = (data: IPage) => PageContentSections;
