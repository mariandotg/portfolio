import { cache } from 'react';
import { ContentfulQueryObject } from '@/models/contentful/GetContentfulData';
import { RawData } from '@/models/contentful/RawData';

const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export const getContentfulData = cache(
  async <T>(
    contentfulQueryObject: ContentfulQueryObject
  ): Promise<Array<T>> => {
    return client
      .getEntries(contentfulQueryObject)
      .then((response: RawData<T>) => response.items)
      .catch((error: object) => console.log(error));
  }
);
