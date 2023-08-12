import { RawPreviewArticle, PreviewArticle } from '@/models/blog/blog.models';

export const rawToPreview = (article: RawPreviewArticle): PreviewArticle => {
  const {
    id,
    attributes: { category, publishedAt, title, path, image: imageData },
  } = article;
  const image = {
    placeholder: imageData.data.attributes.placeholder,
    name: imageData.data.attributes.name,
    alternativeText: imageData.data.attributes.alternativeText,
    width: imageData.data.attributes.width,
    height: imageData.data.attributes.height,
    url: imageData.data.attributes.url,
  };
  return { path, title, publishedAt, category, id, image };
};

export const rawsToPreviews = (
  articles: RawPreviewArticle[]
): PreviewArticle[] => {
  return articles.map((article) => rawToPreview(article));
};
