'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  href: string
  title: string
}

export function Item({ href, title }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === href
  const q = searchParams.get('q')
  const DynamicTag = active ? 'p' : Link

  return (
    <li className="mt-2 flex text-sm text-foreground">
      <DynamicTag
        className={clsx(
          'w-full font-mono uppercase text-foreground/70 px-2 text-sm py-1 rounded-md hover:bg-card/60 hover:text-foreground',
          {
            'bg-card text-foreground border border-primary': active,
          },
        )}
        href={href}
        prefetch={!active ? false : undefined}
      >
        {title}
      </DynamicTag>
    </li>
  )
}
