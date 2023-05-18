export const notionTagsAdapter = (tags: any[]) => {
  return tags.map((tag) => {
    return {
      id: tag.id,
      name: tag.name,
    };
  });
};
