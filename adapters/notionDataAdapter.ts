import { NotionClientQueryResponse } from '@/models/notion/NotionClientQueryResponse';
import { NotionResponse } from '@/models/notion/NotionResponse';

export const notionDataAdapter = (
  data: NotionClientQueryResponse
): Array<NotionResponse> => {
  const response: Array<NotionResponse> = [];
  data.results.forEach(
    (element, index) =>
      (response[index] = {
        object: element.object,
        id: element.id,
        properties: element.properties,
      })
  );
  return response;
};
