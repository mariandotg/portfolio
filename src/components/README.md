# Blog MDX Components

Use React components directly in MDX files by importing them.

## How to Use

### In Your MDX Files

```mdx
---
title: "My Post"
description: "Interactive blog post"
pubDate: 2025-02-15
---

import Counter from "../../components/Counter";
import AlertBox from "../../components/AlertBox";

# My Post

<Counter client:load />

<AlertBox type="success" title="Note" client:load>
  Always use the `client:load` directive for interactive components!
</AlertBox>
```

### Creating New Components

1. Create your React component in `src/components/`:

```tsx
// src/components/MyComponent.tsx
import { useState } from "react";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

2. Import and use it in any MDX file:

```mdx
import MyComponent from "../../components/MyComponent";

<MyComponent client:load />
```

## Currently Available Components

- **Counter**: Interactive counter with increment button
- **AlertBox**: Dismissible alert boxes with different types (info, warning, success, error)

## Features

- **Per-File Control**: Each MDX file imports only what it needs
- **Flexible Hydration**: Choose `client:load`, `client:idle`, `client:visible`, etc.
- **Type-Safe**: Full TypeScript support
- **Standard MDX**: Uses standard MDX import syntax

## Component Requirements

Your React components should:

- Use React hooks for state management (`useState`, `useEffect`, etc.)
- Be default exports
- Accept props via TypeScript interfaces (optional but recommended)

## Client Directives

Always add a client directive to interactive React components:

- `client:load` - Hydrate immediately (best for above-the-fold interactive components)
- `client:idle` - Hydrate when browser is idle
- `client:visible` - Hydrate when component enters viewport
- `client:only="react"` - Only render on client, skip SSR

## Example with Props

```tsx
// src/components/Greeting.tsx
interface GreetingProps {
  name: string;
  color?: string;
}

export default function Greeting({ name, color = "blue" }: GreetingProps) {
  return <div style={{ color }}>Hello, {name}!</div>;
}
```

Use in MDX:

```mdx
import Greeting from "../../components/Greeting";

<Greeting name="World" color="green" client:load />
```

## Advantages of This Approach

- ✅ Standard MDX import syntax
- ✅ No template modifications needed
- ✅ Per-page component loading (better performance)
- ✅ Explicit hydration control
- ✅ Works with any Astro project
- ✅ Easy to understand and maintain
