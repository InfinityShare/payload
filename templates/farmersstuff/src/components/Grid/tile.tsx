import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Label } from '@/components/Grid/Label'
import clsx from 'clsx'
import React from 'react'

type Props = {
  active?: boolean
  isInteractive?: boolean
  label?: {
    amount: number
    position?: 'bottom' | 'center'
    title: string
  }
  media: MediaType
}

export const GridTileImage: React.FC<Props> = ({
  active,
  isInteractive = true,
  label,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'group relative w-full aspect-[4/3] overflow-hidden rounded-lg border bg-[#f5f5f5] hover:border-primary',
        {
          'border-2 border-primary': active,
          'border-border': !active,
        },
      )}
    >
      {props.media ? (
        <Media
          className={clsx('absolute inset-0 w-full h-full', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
          })}
          height={300}
          imgClassName="w-full h-full object-cover"
          resource={props.media}
          width={400}
        />
      ) : null}
      {label ? <Label amount={label.amount} position={label.position} title={label.title} /> : null}
    </div>
  )
}
