import { cn } from '@/utilities/cn'
import React from 'react'
import type { ChecklistBlock as ChecklistBlockProps } from '@/payload-types'

export const ChecklistBlockComponent: React.FC<
  ChecklistBlockProps & {
    id?: string | number
    className?: string
    fullWidth?: boolean
  }
> = ({ title, items, className }) => {
  if (!items?.length) return null

  return (
    <div className={cn(className)}>
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="shrink-0 mt-0.5 text-primary"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10L8 14L16 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-base">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
