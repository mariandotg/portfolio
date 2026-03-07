# Using React Components in MDX Blog Posts

## Quick Start

Import and use React components directly in your MDX files with the `client:load` directive.

### Example MDX File

```mdx
---
title: "My Post"
description: "A post with interactive components"
pubDate: 2025-02-15
---

import Counter from "../../components/Counter";
import AlertBox from "../../components/AlertBox";

# My Blog Post

Use components with the client:load directive:

<Counter client:load />

<AlertBox type="success" title="Success!" client:load>
  This is an interactive alert that can be dismissed.
</AlertBox>
```

### Adding New Components

1. Create your component in `src/components/YourComponent.tsx`
2. Import it at the top of your MDX file:
   ```mdx
   import YourComponent from "../../components/YourComponent";
   ```
3. Use it with `client:load`:
   ```mdx
   <YourComponent client:load />
   ```

### Available Components

- **Counter**: Interactive counter with increment button
- **AlertBox**: Dismissible alert boxes with different types (info, warning, success, error)

See `src/components/README.md` for component documentation.

## Client Directives

- `client:load` - Hydrate immediately on page load (recommended for interactive components)
- `client:idle` - Hydrate when browser is idle
- `client:visible` - Hydrate when component enters viewport
- `client:only="react"` - Only render on client, skip SSR

## Passing Props

Pass props just like in React:

```mdx
<AlertBox 
  type="warning" 
  title="Important!" 
  client:load
>
  Your custom message here
</AlertBox>
```

## Testing

Run the dev server:

```bash
pnpm dev
```

Visit your blog at `http://localhost:4321/blog/hello-world`
