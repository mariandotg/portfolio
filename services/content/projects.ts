import { GITHUB_TOKEN } from '@/config';
import {
  ProjectMeta,
  FullProject,
  PreviewProject,
} from '@/models/blog/blog.models';
import { randomUUID } from 'crypto';
import { compileMDX } from 'next-mdx-remote/rsc';

type Filetree = [
  {
    name: string;
    path: string;
    type: string;
  }
];

export const fetchProjectByPath = async (
  path: string,
  lang: string = 'en'
): Promise<FullProject | undefined> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/mariandotg/portfolio-content/main/projects/${path}/${lang}/content.mdx`,
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

  const { frontmatter, content } = await compileMDX<ProjectMeta>({
    source: rawMDX,
    options: { parseFrontmatter: true },
  });

  const tags: { id: string; name: string }[] = frontmatter.tags.reduce(
    (prev, curr) => {
      const id = randomUUID();
      return [...prev, { id, name: curr }];
    },
    [] as { id: string; name: string }[]
  );

  const blogPostObj: FullProject = {
    title: frontmatter.title,
    description: frontmatter.description,
    path,
    tags,
    repository: frontmatter.repository || 'repository https',
    live: frontmatter.live || 'live https',
    publishedAt: frontmatter.date,
    image: frontmatter.image,
    locale: frontmatter.locale,
    locales: {},
    meta: { ...frontmatter },
    content,
  };

  return blogPostObj;
};

export const fetchProjects = async (
  lang: string = 'en'
): Promise<PreviewProject[] | undefined> => {
  const response = await fetch(
    `https://api.github.com/repos/mariandotg/portfolio-content/contents/projects?recursive=1`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-cache',
      next: {
        tags: [`projects-${lang}`],
      },
    }
  );

  if (!response.ok) return undefined;

  const repoFiletree: Filetree = await response.json();

  const filesArray = repoFiletree
    .filter((obj) => obj.type === 'dir')
    .map((obj) => obj.name);

  const posts: PreviewProject[] = [];

  for (const file of filesArray) {
    const post = await fetchProjectByPath(file, lang);
    if (post) {
      const { meta, tags } = post;
      const previewProject: PreviewProject = {
        id: meta.id,
        title: meta.title,
        publishedAt: meta.date,
        tags,
        path: meta.path,
        image: {
          url: meta.image,
          name: meta.title,
          placeholder: meta.title,
          alternativeText: meta.imageAlt,
        },
        description: meta.description,
      };
      posts.push(previewProject);
    }
  }

  return posts; //.sort((a, b) => (a.date < b.date ? 1 : -1));
};
