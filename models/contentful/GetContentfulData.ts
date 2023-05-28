import { CONTENT_TYPE } from './generated/contentful';

export interface ContentfulQueryObject {
  content_type: CONTENT_TYPE;
  include: number;
  locale: string;
  [dynamicField: string]: string | number | CONTENT_TYPE;
}

export type GetContentfulData = <T>(
  contentfulQueryObject: ContentfulQueryObject
) => Array<T>;
