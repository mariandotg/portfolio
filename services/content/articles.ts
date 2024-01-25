import { GITHUB_TOKEN } from '@/config';
import {
  ArticleMeta,
  FullArticle,
  PreviewArticle,
} from '@/models/blog/blog.models';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';

type Filetree = [
  {
    name: string;
    path: string;
    type: string;
  }
];

export interface PaginatedResponse<T> {
  total: number;
  totalPages: number;
  pageSize: number;
  page: number;
  results: T[];
}

interface ErrorResponse {
  message: string;
}

export const fetchArticleByPath = async (
  path: string,
  lang: string = 'en'
): Promise<FullArticle | undefined> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/mariandotg/portfolio-content/main/articles/${path}/${lang}/content.mdx`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'force-cache',
    }
  );

  if (!response.ok) return undefined;

  const rawMDX = await response.text();

  if (rawMDX === '404: Not Found') return undefined;

  const { frontmatter, content } = await compileMDX<ArticleMeta>({
    source: rawMDX,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        //@ts-ignore
        rehypePlugins: [rehypeHighlight],
      },
    },
  });

  const blogPostObj: FullArticle = {
    title: frontmatter.title,
    description: frontmatter.description,
    path,
    category: frontmatter.category,
    publishedAt: frontmatter.date,
    image: frontmatter.image,
    locale: frontmatter.locale,
    locales: {},
    meta: { ...frontmatter },
    content,
  };

  return blogPostObj;
};

export const fetchArticles = async (
  lang: string = 'en'
): Promise<PreviewArticle[] | undefined> => {
  const response = await fetch(
    `https://api.github.com/repos/mariandotg/portfolio-content/contents/articles?recursive=1`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'force-cache',
      next: {
        tags: [`articles-${lang}`],
      },
    }
  );

  if (!response.ok) return undefined;

  const repoFiletree: Filetree = await response.json();

  const filesArray = repoFiletree
    .filter((obj) => obj.type === 'dir')
    .map((obj) => obj.name);

  const posts: PreviewArticle[] = [];

  for (const file of filesArray) {
    const post = await fetchArticleByPath(file, lang);
    if (post) {
      const { meta } = post;
      const previewArticle: PreviewArticle = {
        id: meta.id,
        title: meta.title,
        publishedAt: meta.date,
        category: meta.category,
        path: meta.path,
        description: meta.description,
        image: {
          url: meta.image,
          name: meta.title,
          placeholder: meta.title,
          alternativeText: meta.imageAlt,
        },
      };
      posts.push(previewArticle);
    }
  }
  return posts; //.sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const getPaginatedArticles = async (
  page: number,
  lang: string = 'en'
): Promise<PaginatedResponse<PreviewArticle> | ErrorResponse> => {
  const pageSize = 10;
  const articles = await fetchArticles(lang);

  if (!articles) return { message: 'Error running fetchArticles() method' };

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const results = articles.slice(start, end);
  const totalPages = Math.ceil(articles.length / pageSize);

  return {
    total: articles.length,
    totalPages,
    pageSize,
    page,
    results,
  };
};
