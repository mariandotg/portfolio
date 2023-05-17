export interface RawData<T> {
  sys: object;
  total: number;
  skip: number;
  limit: number;
  items: Array<T>;
}
