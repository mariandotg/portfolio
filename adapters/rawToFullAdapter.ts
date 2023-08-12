import { RawFullArticle } from '@/models/blog/blog.models';

export const rawToFull = (article: RawFullArticle) => {
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
    id,
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
