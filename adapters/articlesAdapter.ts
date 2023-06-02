import { notionTagsAdapter } from './notionTagsAdapter';

import { Article } from '@/models/domain/Article';
import { CompoundFilterObj } from '@/models/notion/Filters';

export const articlesAdapter = (post: any[]): Array<Article> => {
  return post.map((p) => {
    return {
      id: p?.id,
      path: p?.properties?.SeoPath?.formula?.string || '',
      date: p?.properties?.Date?.date || '',
      image: p?.properties?.Image?.files[0]?.external?.url || '',
      imageAlt: p?.properties?.ImageAlt?.rich_text[0]?.plain_text || '',
      tags: notionTagsAdapter(p?.properties?.Tags?.multi_select) || '',
      name: p?.properties?.Name?.title[0]?.plain_text || '',
      description: p?.properties?.Description?.rich_text[0]?.plain_text || '',
    };
  });
};

export const articlesFilter: CompoundFilterObj = {
  and: [
    {
      property: 'Stage',
      select: {
        equals: 'Published',
      },
    },
    {
      property: 'LatestArticle',
      checkbox: {
        equals: true,
      },
    },
    {
      property: 'Database',
      select: {
        equals: 'Articles Database',
      },
    },
  ],
};
