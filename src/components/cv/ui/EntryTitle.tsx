import * as React from 'react'

import { cn } from '@/lib/utils'

/** Shared title voice for company, institution, and project names on the CV. */
export const entryTitleClassName =
  'font-semibold leading-none tracking-normal text-[length:var(--text-subtitle)] [line-height:var(--text-subtitle--line-height)]'

type EntryTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h3' | 'p'
}

const EntryTitle = React.forwardRef<HTMLHeadingElement, EntryTitleProps>(
  ({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag ref={ref} className={cn(entryTitleClassName, className)} {...props} />
  ),
)
EntryTitle.displayName = 'EntryTitle'

export { EntryTitle }
