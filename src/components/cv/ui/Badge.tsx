import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { Badge as UiBadge, badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type BadgeProps = React.ComponentProps<typeof UiBadge> &
  VariantProps<typeof badgeVariants>

function Badge({ className, ...props }: BadgeProps) {
  return (
    <UiBadge
      className={cn('rounded-md font-mono font-normal', className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
