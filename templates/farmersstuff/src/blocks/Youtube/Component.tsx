import { cn } from '@/utilities/cn'
import React from 'react'
import type { YoutubeBlock as YoutubeBlockProps } from '@/payload-types'

function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1)
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
  } catch {
    // not a valid URL
  }
  return null
}

export const YoutubeBlockComponent: React.FC<
  YoutubeBlockProps & {
    id?: string | number
    className?: string
    fullWidth?: boolean
  }
> = ({ url, title, className, fullWidth }) => {
  if (!url) return null

  const videoId = extractYoutubeId(url)
  if (!videoId) return null

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`

  return (
    <div className={cn(className)}>
      {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full rounded-lg border border-border"
          src={embedUrl}
          title={title || 'YouTube Video'}
        />
      </div>
    </div>
  )
}
