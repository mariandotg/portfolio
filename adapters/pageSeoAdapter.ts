import { PageSeo } from "@/models/PageSeo";

export const pageSeoAdapter = (post: any): Omit<PageSeo, 'loading'> => {
  console.log(post);
  return {
    id: post.id,
    title: post.properties.SeoTitle.rich_text[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    image: post.properties.Image.files[0].external.url,
    imageAlt: post.properties.ImageAlt.rich_text[0].plain_text,
    slug: post.properties.SeoSlug.rich_text[0].plain_text,
    path: post.properties.SeoPath.formula.string,
    url: post.properties.SeoUrl.rich_text[0].plain_text,
    openGraphType: post.properties.SeoOpenGraphType.rich_text[0].plain_text,
    schemaType: post.properties.SeoSchemaType.rich_text[0].plain_text,
  };
};
