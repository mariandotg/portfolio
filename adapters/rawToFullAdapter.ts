import {
  FullArticle,
  FullProject,
  RawFullArticle,
  RawFullProject,
} from '@/models/blog/blog.models';
import { randomUUID } from 'crypto';

export const rawToFullArticle = (article: RawFullArticle): FullArticle => {
  const {
    id,
    attributes: {
      title,
      content,
      description,
      path,
      category,
      canonicalUrl,
      openGraphType,
      schemaType,
      publishedAt,
      locale,
      image,
      localizations,
    },
  } = article;
  const seo = {
    title,
    id: id.toString(),
    description,
    image: image.data.attributes.url,
    imageAlt: image.data.attributes.alternativeText,
    slug: path,
    path,
    openGraphType,
    url: canonicalUrl,
    schemaType,
  };
  const locales = localizations.data.map((localization, index) => {
    const id = localization.id;
    const locale = localization.attributes.locale;
    return { locale, id };
  });

  return {
    title,
    content,
    description,
    path,
    category,
    seo,
    publishedAt,
    locale,
    image,
    locales,
  };
};

export const rawToFullProject = (project: RawFullProject): FullProject => {
  const {
    id,
    attributes: {
      title,
      content,
      description,
      path,
      tags: rawTags,
      repository,
      live,
      canonicalUrl,
      openGraphType,
      schemaType,
      publishedAt,
      locale,
      image,
      localizations,
    },
  } = project;
  const tags: { id: string; name: string }[] = rawTags.reduce((prev, curr) => {
    const id = randomUUID();
    return [...prev, { id, name: curr }];
  }, [] as { id: string; name: string }[]);
  const seo = {
    title,
    id: id.toString(),
    description,
    image: image.data.attributes.url,
    imageAlt: image.data.attributes.alternativeText,
    slug: path,
    path,
    openGraphType,
    url: canonicalUrl,
    schemaType,
  };
  const locales = localizations.data.map((localization, index) => {
    const id = localization.id;
    const locale = localization.attributes.locale;
    return { locale, id };
  });

  return {
    title,
    content,
    description,
    path,
    tags,
    repository,
    live,
    seo,
    publishedAt,
    locale,
    image,
    locales,
  };
};
