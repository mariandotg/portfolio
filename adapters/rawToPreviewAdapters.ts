import {
  RawPreviewArticle,
  PreviewArticle,
  RawPreviewProject,
  PreviewProject,
} from '@/models/blog/blog.models';
import { randomUUID } from 'crypto';

export const rawToPreviewArticle = (
  article: RawPreviewArticle
): PreviewArticle => {
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

export const rawToPreviewProject = (
  project: RawPreviewProject
): PreviewProject => {
  const {
    id,
    attributes: { tags: rawTags, publishedAt, title, path, image: imageData },
  } = project;
  const tags: { id: string; name: string }[] = rawTags.reduce((prev, curr) => {
    const id = randomUUID();
    return [...prev, { id, name: curr }];
  }, [] as { id: string; name: string }[]);
  const image = {
    placeholder: imageData.data.attributes.placeholder,
    name: imageData.data.attributes.name,
    alternativeText: imageData.data.attributes.alternativeText,
    width: imageData.data.attributes.width,
    height: imageData.data.attributes.height,
    url: imageData.data.attributes.url,
  };
  return { path, title, publishedAt, tags, id, image };
};

export const rawsToPreviewArticles = (
  articles: RawPreviewArticle[]
): PreviewArticle[] => {
  return articles.map((article) => rawToPreviewArticle(article));
};

export const rawsToPreviewProjects = (
  projects: RawPreviewProject[]
): PreviewProject[] => {
  return projects.map((project) => rawToPreviewProject(project));
};
