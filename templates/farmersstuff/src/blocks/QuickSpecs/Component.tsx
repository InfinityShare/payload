import { cn } from '@/utilities/cn'
import Image from 'next/image'
import React from 'react'
import type { QuickSpecsBlock as QuickSpecsBlockProps } from '@/payload-types'

export const QuickSpecsBlockComponent: React.FC<
  QuickSpecsBlockProps & {
    id?: string | number
    className?: string
    fullWidth?: boolean
  }
> = ({ specs, className }) => {
  if (!specs?.length) return null

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {specs.map((spec, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-md"
        >
          <Image
            src={`/media/${spec.icon}.svg`}
            alt={spec.label}
            width={20}
            height={20}
            className="shrink-0"
          />
          <span className="text-sm font-medium">{spec.label}</span>
        </div>
      ))}
    </div>
  )
}
