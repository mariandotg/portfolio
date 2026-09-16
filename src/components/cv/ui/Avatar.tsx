import * as React from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

export interface AvatarProps {
  src: string
  alt: string
  fallbackText: string
}

const AvatarComponent = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallbackText }) => {
    return (
      <Avatar className="size-28 rounded-xl">
        <AvatarImage alt={alt} src={src} />
        <AvatarFallback className="rounded-xl">{fallbackText}</AvatarFallback>
      </Avatar>
    )
  },
)
AvatarComponent.displayName = 'AvatarComponent'

export { Avatar, AvatarComponent, AvatarFallback, AvatarImage }
