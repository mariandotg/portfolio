import { notionDataAdapter } from '@/adapters/notionDataAdapter';
import { FilterObj, CompoundFilterObj } from '@/models/notion/Filters';
import { NotionClientQueryResponse } from '@/models/notion/NotionClientQueryResponse';
import { NotionResponse } from '@/models/notion/NotionResponse';

const { Client } = require('@notionhq/client');

const { NotionToMarkdown } = require('notion-to-md');

const client = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_AUTH_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: client });

interface Props {
  databaseId: string;
  filter: FilterObj<{ [key: string]: unknown }> | CompoundFilterObj;
}

export const queryNotionDatabase = async ({
  databaseId,
  filter,
}: Props): Promise<Array<NotionResponse>> => {
  const response: NotionClientQueryResponse = await client.databases.query({
    database_id: databaseId,
    filter,
  });

  return notionDataAdapter(response);
};

export const getNotionSinglePage = async ({
  databaseId,
  filter,
}: Props): Promise<any> => {
  const response: NotionClientQueryResponse = await client.databases.query({
    database_id: databaseId,
    filter,
  });

  const page = response.results[0];
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  return {
    markdown: mdString,
  };
};
