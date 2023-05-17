import { CONTENT_TYPE } from './generated/contentful';

export interface Params {
  type: CONTENT_TYPE;
  locale: string;
}

export type GetContentfulData = <T>({
  type,
  locale = 'en-US',
}: Params) => Array<T>;
