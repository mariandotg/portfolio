/**
 * CV-only Button fork — not deletable in favour of `@/components/ui/button`.
 * `SocialMediaList` uses `asChild` with Astro-authored anchors; Astro passes
 * those slots as `SlotString` (serialized HTML, no React `children`), so Radix
 * `Slot` cannot merge `className`. `injectClassOnSlotString` patches the slot
 * markup instead.
 */
import { type SlotProps } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { SlotString } from 'astro/runtime/server/render/slot.js'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-sm px-3',
        lg: 'h-11 rounded-sm px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function injectClassOnSlotString(
  children: React.ReactElement,
  className: string,
): SlotString {
  const stringValue: string = children.props.toString()
  const index = stringValue.indexOf('>\n')

  const modifiedValue =
    index !== -1
      ? stringValue.slice(0, index) +
        ` class="${className}">\n` +
        stringValue.slice(index + 2)
      : stringValue

  return new SlotString(modifiedValue, null)
}

const Slot: React.FunctionComponent<SlotProps> = (props) => {
  const { children, className } = props
  if (!React.isValidElement(children)) {
    return
  }
  // If it's called inside a React component
  if (children.props.children !== undefined) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, { className })
  }

  // If it's called inside a Astro component(or page)
  const newValue = injectClassOnSlotString(children, className || '')
  const newChildren = {
    ...children,
    props: { ...children.props, value: newValue },
  }
  return React.cloneElement(newChildren)
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
