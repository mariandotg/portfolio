# MDX components in notes

The maintained catalogue — props, budgets, and when to use each component — is
[`.claude/skills/blog-post/COMPONENTS.md`](../.claude/skills/blog-post/COMPONENTS.md).

## Import path

Note components live in `src/components/notes/`. Typical imports:

```mdx
import Callout from "../../components/notes/Callout.astro";
import SideBySide from "../../components/notes/SideBySide.astro";
import Tabs from "../../components/notes/Tabs.astro";
import Tab from "../../components/notes/Tab.astro";
```

## Callouts

Three variants only: `note`, `rule`, `warning`. Sentence-case titles, no emoji.
See `docs/design/design-system.md` §6.

## Interactive islands

Wrap React in an `*Island.astro` file and import the wrapper from MDX. Add
`client:load`, `client:idle`, or `client:visible` on the wrapper as needed.

## Verify locally

```bash
pnpm dev
```

Open the note under `/notes/<slug>` (draft posts are excluded from production
routes until `draft` is cleared).
