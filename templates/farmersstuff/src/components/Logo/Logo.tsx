import React from 'react'

export const Logo = ({ white = false }: { white?: boolean }) => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="FarmersStuff Logo"
      className="max-w-37.5"
      src={white ? '/assets/logo-white.svg' : '/assets/logo-1.svg'}
    />
  )
}
