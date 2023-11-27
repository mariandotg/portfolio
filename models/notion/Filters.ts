export type FilterObj<T extends Record<string, unknown>> = {
  [key: string]: T | string;
};

export type CompoundFilterObj = {
  and: Array<FilterObj<{ [key: string]: unknown }>>;
};
