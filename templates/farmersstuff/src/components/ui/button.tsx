import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

const buttonVariants = cva(
  "relative inline-flex items-center justify-center hover:cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 ',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'border border-input bg-card shadow-xs hover:border-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'text-primary/50 hover:text-primary [&.active]:text-primary py-2 px-4 uppercase font-mono tracking-widest text-xs',
        link: 'text-primary underline-offset-4 hover:underline',
        nav: 'text-foreground/70 hover:text-foreground [&.active]:text-foreground p-0 pt-2 pb-6 uppercase font-mono tracking-widest text-xs',
      },
      size: {
        clear: '',
        default: 'h-11 px-6 py-2.5 text-base font-semibold has-[>svg]:px-4',
        sm: 'h-9 rounded-md gap-1.5 px-4 py-2 text-sm has-[>svg]:px-3',
        lg: 'h-14 px-8 py-3 text-lg font-bold uppercase tracking-wide has-[>svg]:px-6',
        xl: 'h-16 px-10 py-4 text-xl font-bold uppercase tracking-wider has-[>svg]:px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
