import { cache } from 'react';
import { Params } from '@/models/contentful/GetContentfulData';
import { RawData } from '@/models/contentful/RawData';

const contentful = require('contentful');

export const getContentfulData = cache(async <T>({
  type,
  locale = 'en-US',
}: Params): Promise<Array<T>> => {
  const client = await contentful.createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  });
  return client
    .getEntries({
      content_type: type,
      include: 3,
      locale,
    })
    .then((response: RawData<T>) => response.items)
    .catch((error: object) => console.log(error));
})