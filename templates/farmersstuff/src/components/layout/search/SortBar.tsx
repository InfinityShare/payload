'use client'

import type { SortFilterItem } from '@/lib/constants'

import { ChevronDownIcon } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const PAGE_SIZE_OPTIONS = [
  { label: '9', value: 9 },
  { label: '18', value: 18 },
  { label: '36', value: 36 },
  { label: 'Alle', value: 0 },
]

type Props = {
  count: number
  total: number
  sortList: SortFilterItem[]
}

export function SortBar({ count, total, sortList }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentSlug = searchParams.get('sort')
  const activeItem = sortList.find((item) => item.slug === currentSlug) ?? sortList[0]

  const currentLimit = Number(searchParams.get('limit') ?? 9)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  function selectSort(item: SortFilterItem) {
    const params = new URLSearchParams(searchParams.toString())
    if (item.slug) {
      params.set('sort', item.slug)
    } else {
      params.delete('sort')
    }
    router.push(pathname + '?' + params.toString())
    setOpen(false)
  }

  function selectLimit(value: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 0) {
      params.delete('limit')
    } else {
      params.set('limit', String(value))
    }
    router.push(pathname + '?' + params.toString())
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <span className="text-sm text-muted-foreground">
        {total} {total === 1 ? 'Produkt' : 'Produkte'}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded border border-border overflow-hidden">
          {PAGE_SIZE_OPTIONS.map((opt) => {
            const isActive =
              opt.value === 0 ? !searchParams.get('limit') : currentLimit === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => selectLimit(opt.value)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'bg-white text-foreground hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <div className="relative" ref={ref}>
          <button
            className="flex items-center gap-2 rounded border border-border bg-white dark:bg-neutral-900 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            type="button"
          >
            <span className="text-muted-foreground">Sortieren nach:</span>
            <span className="font-medium">{activeItem?.title}</span>
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-1 w-56 rounded-md border border-border bg-white dark:bg-neutral-900 shadow-lg">
              {sortList.map((item) => (
                <button
                  key={item.title}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md hover:bg-gray-100 dark:hover:bg-neutral-800 ${
                    item.slug === currentSlug || (!currentSlug && item.slug === null)
                      ? 'font-semibold text-orange-500'
                      : 'text-foreground'
                  }`}
                  onClick={() => selectSort(item)}
                  type="button"
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
