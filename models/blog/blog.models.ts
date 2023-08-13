export interface PreviewArticle {
  id: number;
  title: string;
  publishedAt: string;
  category: string;
  path: string;
  image: {
    placeholder: string;
    name: string;
    alternativeText?: string;
    width: number;
    height: number;
    url: string;
  };
}

export interface RawFullArticle {
  id: number;
  attributes: Attribute;
}

export interface RawPage {
  id: number;
  attributes: {
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    description: string;
    path: string;
    canonicalUrl: string;
    openGraphType: string;
    schemaType: string;
    image: RawImage;
    localizations: {
      data: [
        {
          id: number;
          attributes: {
            locale: string;
          };
        }
      ];
    };
  };
}

export interface RawPreviewArticle {
  id: number;
  attributes: Pick<
    Attribute,
    'title' | 'publishedAt' | 'category' | 'path' | 'image'
  >;
}

export interface Attribute {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  description: string;
  path: string;
  category: string;
  canonicalUrl: string;
  openGraphType: string;
  schemaType: string;
  image: RawImage;
  localizations: {
    data: [
      {
        id: number;
        attributes: {
          locale: string;
        };
      }
    ];
  };
}

export interface RawImage {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText?: string;
      caption?: string;
      width: number;
      height: number;
      formats: {
        [key: string]: {
          ext: string;
          url: string;
          hash: string;
          mime: string;
          name: string;
          path?: string;
          size: number;
          width: number;
          height: number;
          provider_metadata: {
            public_id: string;
            resource_type: string;
          };
        };
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string;
      provider: string;
      provider_metadata: {
        public_id: string;
        resource_type: string;
      };
      createdAt: string;
      updatedAt: string;
      placeholder: string;
    };
  };
}
