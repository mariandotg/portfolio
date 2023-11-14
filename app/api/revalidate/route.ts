import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const tag = request.nextUrl.searchParams.get('tag') || '/';
  const body = {
    event: 'push',
    payload: {
      ref: 'refs/heads/main',
      before: 'c3edbed25546140b21f25de8ddc5692bf93f169c',
      after: 'a6cef099932e33cb9ddbe1d337772bda958e7094',
      repository: {
        id: 681281085,
        node_id: 'R_kgDOKJuGPQ',
        name: 'portfolio-content',
        full_name: 'mariandotg/portfolio-content',
        private: false,
        owner: {
          name: 'mariandotg',
          email: 'marianguillaume.m@gmail.com',
          login: 'mariandotg',
          id: 84543990,
          node_id: 'MDQ6VXNlcjg0NTQzOTkw',
          avatar_url: 'https://avatars.githubusercontent.com/u/84543990?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/mariandotg',
          html_url: 'https://github.com/mariandotg',
          followers_url: 'https://api.github.com/users/mariandotg/followers',
          following_url:
            'https://api.github.com/users/mariandotg/following{/other_user}',
          gists_url: 'https://api.github.com/users/mariandotg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/mariandotg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/mariandotg/subscriptions',
          organizations_url: 'https://api.github.com/users/mariandotg/orgs',
          repos_url: 'https://api.github.com/users/mariandotg/repos',
          events_url:
            'https://api.github.com/users/mariandotg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/mariandotg/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/mariandotg/portfolio-content',
        description: null,
        fork: false,
        url: 'https://github.com/mariandotg/portfolio-content',
        forks_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/forks',
        keys_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/teams',
        hooks_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/hooks',
        issue_events_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/events',
        assignees_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/tags',
        blobs_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/languages',
        stargazers_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/stargazers',
        contributors_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/contributors',
        subscribers_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/subscribers',
        subscription_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/subscription',
        commits_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/merges',
        archive_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/downloads',
        issues_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/labels{/name}',
        releases_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/mariandotg/portfolio-content/deployments',
        created_at: 1692637583,
        updated_at: '2023-08-21T17:09:30Z',
        pushed_at: 1699983051,
        git_url: 'git://github.com/mariandotg/portfolio-content.git',
        ssh_url: 'git@github.com:mariandotg/portfolio-content.git',
        clone_url: 'https://github.com/mariandotg/portfolio-content.git',
        svn_url: 'https://github.com/mariandotg/portfolio-content',
        homepage: null,
        size: 251,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'MDX',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        has_discussions: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 0,
        license: null,
        allow_forking: true,
        is_template: false,
        web_commit_signoff_required: false,
        topics: [],
        visibility: 'public',
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: 'main',
        stargazers: 0,
        master_branch: 'main',
      },
      pusher: { name: 'mariandotg', email: 'marianguillaume.m@gmail.com' },
      sender: {
        login: 'mariandotg',
        id: 84543990,
        node_id: 'MDQ6VXNlcjg0NTQzOTkw',
        avatar_url: 'https://avatars.githubusercontent.com/u/84543990?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/mariandotg',
        html_url: 'https://github.com/mariandotg',
        followers_url: 'https://api.github.com/users/mariandotg/followers',
        following_url:
          'https://api.github.com/users/mariandotg/following{/other_user}',
        gists_url: 'https://api.github.com/users/mariandotg/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/mariandotg/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/mariandotg/subscriptions',
        organizations_url: 'https://api.github.com/users/mariandotg/orgs',
        repos_url: 'https://api.github.com/users/mariandotg/repos',
        events_url: 'https://api.github.com/users/mariandotg/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/mariandotg/received_events',
        type: 'User',
        site_admin: false,
      },
      created: false,
      deleted: false,
      forced: false,
      base_ref: null,
      compare:
        'https://github.com/mariandotg/portfolio-content/compare/c3edbed25546...a6cef099932e',
      commits: [
        {
          id: 'a6cef099932e33cb9ddbe1d337772bda958e7094',
          tree_id: '33f47cd058d4929b2a43bbdbb48e125b82b6149d',
          distinct: true,
          message: 'Fixed missing uppercases',
          timestamp: '2023-11-14T14:30:48-03:00',
          url: 'https://github.com/mariandotg/portfolio-content/commit/a6cef099932e33cb9ddbe1d337772bda958e7094',
          author: {
            name: 'Mariano Guillaume',
            email: 'marianguillaume.m@gmail.com',
            username: 'mariandotg',
          },
          committer: {
            name: 'Mariano Guillaume',
            email: 'marianguillaume.m@gmail.com',
            username: 'mariandotg',
          },
          added: [],
          removed: [],
          modified: [
            'projects/neuratech/en/content.mdx',
            'projects/neuratech/es/content.mdx',
          ],
        },
      ],
      head_commit: {
        id: 'a6cef099932e33cb9ddbe1d337772bda958e7094',
        tree_id: '33f47cd058d4929b2a43bbdbb48e125b82b6149d',
        distinct: true,
        message: 'Fixed missing uppercases',
        timestamp: '2023-11-14T14:30:48-03:00',
        url: 'https://github.com/mariandotg/portfolio-content/commit/a6cef099932e33cb9ddbe1d337772bda958e7094',
        author: {
          name: 'Mariano Guillaume',
          email: 'marianguillaume.m@gmail.com',
          username: 'mariandotg',
        },
        committer: {
          name: 'Mariano Guillaume',
          email: 'marianguillaume.m@gmail.com',
          username: 'mariandotg',
        },
        added: [],
        removed: [],
        modified: [
          'projects/neuratech/en/content.mdx',
          'projects/neuratech/es/content.mdx',
        ],
      },
    },
  };

  console.log(body.payload.commits[0].modified);
  console.log({ AAAAAAAASDDDDDDDDDDDD: tag });

  const tagsSet = new Set();

  body.payload.commits[0].modified.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });
  body.payload.commits[0].added.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });
  body.payload.commits[0].removed.forEach((edits: string) => {
    if (edits.startsWith('projects')) tagsSet.add('projects');
    else if (edits.startsWith('articles')) tagsSet.add('articles');
  });

  const array = Array.from(tagsSet) as string[];
  console.log({ tagsSet, array });

  array.forEach((tag) => {
    revalidateTag(tag);
  });

  return NextResponse.json({ revalidated: true });
}
