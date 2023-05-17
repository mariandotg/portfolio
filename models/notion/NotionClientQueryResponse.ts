interface Result {
  object: string;
  id: string;
  created_time: Object;
  last_edited_time: Object;
  create_by: Object;
  cover: null;
  icon: Object;
  parent: Object;
  archived: boolean;
  properties: Object;
  url: string;
}

export interface NotionClientQueryResponse {
  object: string;
  results: Array<Result>;
  next_cursor: null;
  has_more: boolean;
  type: string;
  page: Object;
}
