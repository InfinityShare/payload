import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button variant="nav" size="clear" className="navLink relative hover:cursor-pointer" {...rest}>
      <ShoppingCart className="h-5 w-5" />
      {quantity ? (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground leading-none">
          {quantity > 9 ? '9+' : quantity}
        </span>
      ) : null}
    </Button>
  )
}
