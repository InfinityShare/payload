import { cn } from '@/utilities/cn'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { IconFeaturesBlock as IconFeaturesBlockProps } from '@/payload-types'

export const IconFeaturesBlockComponent: React.FC<
  IconFeaturesBlockProps & {
    id?: string | number
    className?: string
    fullWidth?: boolean
  }
> = ({ features, className }) => {
  if (!features?.length) return null

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-6', className)}>
      {features.map((feature, index) => {
        const inner = (
          <div
            className={cn(
              'flex flex-col items-center text-center gap-4 p-6 bg-card border border-border rounded-lg h-full',
              feature.enableLink && 'hover:border-primary transition-colors cursor-pointer',
            )}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
              <Image
                src={`/media/${feature.icon}.svg`}
                alt={feature.headline}
                width={28}
                height={28}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{feature.headline}</h3>
              {feature.text && <p className="text-sm text-muted-foreground mt-1">{feature.text}</p>}
              {feature.enableLink && feature.link?.label && (
                <span className="text-sm text-primary font-medium mt-2 inline-block">
                  {feature.link.label} →
                </span>
              )}
            </div>
          </div>
        )

        if (feature.enableLink && feature.link?.url) {
          return (
            <Link
              key={index}
              href={feature.link.url}
              target={feature.link.newTab ? '_blank' : undefined}
              rel={feature.link.newTab ? 'noopener noreferrer' : undefined}
              className="h-full"
            >
              {inner}
            </Link>
          )
        }

        return (
          <div key={index} className="h-full">
            {inner}
          </div>
        )
      })}
    </div>
  )
}
