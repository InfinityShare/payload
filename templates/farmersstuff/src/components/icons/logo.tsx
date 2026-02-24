import clsx from 'clsx'
import React from 'react'

export function LogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/assets/farmersstuff-white.svg"
      alt="FarmersStuff"
      {...props}
      className={clsx('h-8 w-auto', props.className)}
    />
  )
}
