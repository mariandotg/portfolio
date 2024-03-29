import { notionDataAdapter } from '@/adapters/notionDataAdapter';
import { pageSeoAdapter } from '@/adapters/pageSeoAdapter';
import { FilterObj, CompoundFilterObj } from '@/models/notion/Filters';
import { NotionClientQueryResponse } from '@/models/notion/NotionClientQueryResponse';
import { NotionResponse } from '@/models/notion/NotionResponse';
import { cache } from 'react';

const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

const client = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_AUTH_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: client });

interface NotionConfig {
  databaseId: string;
  filter: FilterObj<{ [key: string]: unknown }> | CompoundFilterObj;
  pageSize: number;
}

export const queryDatabase = cache(
  async (notionConfig: NotionConfig): Promise<Array<NotionResponse>> => {
    const response: NotionClientQueryResponse = await client.databases.query({
      database_id: notionConfig.databaseId,
      filter: notionConfig.filter,
      page_size: notionConfig.pageSize,
    });

    return notionDataAdapter(response);
  }
);

interface NotionPageConfigObject {
  seo?: boolean;
  content?: boolean;
  properties?: {
    adapter: (props: any[]) => any[];
  };
}

export const getPageData = async (
  notionConfig: NotionConfig,
  notionPageConfigObject: NotionPageConfigObject
): Promise<any> => {
  const { seo, content, properties } = notionPageConfigObject;
  const resultado: any = {};

  try {
    const response: NotionClientQueryResponse = await client.databases.query({
      database_id: notionConfig.databaseId,
      filter: notionConfig.filter,
      pageSize: notionConfig.pageSize,
    });
    const page = notionDataAdapter(response);

    if (seo) {
      const seoResponse = pageSeoAdapter(page[0]);
      resultado.seo = seoResponse;
    }

    if (content) {
      const mdblocks = await n2m.pageToMarkdown(page[0].id);
      const mdString = n2m.toMarkdownString(mdblocks);
      resultado.content = mdString;
    }

    if (properties) {
      const propertiesResponse = properties.adapter(page)[0];
      resultado.properties = propertiesResponse;
    }
  } catch {
    return false;
  }
  return resultado;
};
