import { notionTagsAdapter } from './notionTagsAdapter';

import { Project } from '@/models/domain/Project';
import { CompoundFilterObj } from '@/models/notion/Filters';

export const projectsAdapter = (post: any[]): Array<Project> => {
  return post.map((p) => {
    return {
      id: p?.id,
      path: p?.properties?.SeoPath?.formula?.string || '',
      image: p?.properties?.Image?.files[0]?.external?.url || '',
      imageAlt: p?.properties?.ImageAlt?.rich_text[0]?.plain_text || '',
      tags: notionTagsAdapter(p?.properties?.Tags?.multi_select) || '',
      name: p?.properties?.Name?.title[0]?.plain_text || '',
      description: p?.properties?.Description?.rich_text[0]?.plain_text || '',
      repository: p?.properties?.Repository?.url || '',
      live: p?.properties?.Live?.url || '',
    };
  });
};

export const projectsFilter: CompoundFilterObj = {
  and: [
    {
      property: 'Stage',
      select: {
        equals: 'Published',
      },
    },
    {
      property: 'Database',
      select: {
        equals: 'Projects Database',
      },
    },
  ],
};
