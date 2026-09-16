# Notes MDX components

Authoring catalogue for note bodies lives in
[`.claude/skills/blog-post/COMPONENTS.md`](../../.claude/skills/blog-post/COMPONENTS.md)
(props, when to use each component, and series budgets). Read that before adding
or extending a note component.

Implementation lives under `src/components/notes/`. Import Astro components from
there in MDX; use a `*Island.astro` wrapper when a React island needs
hydration.

## Quick pattern

```mdx
import Callout from "../../components/notes/Callout.astro";
import SideBySide from "../../components/notes/SideBySide.astro";

<Callout type="rule" title="The rule">
  One line the reader should remember.
</Callout>
```

Interactive React pieces need a `client:*` directive on the island wrapper, not
on raw `.tsx` files. See `RetrySimulatorIsland.astro` for the usual shape.
