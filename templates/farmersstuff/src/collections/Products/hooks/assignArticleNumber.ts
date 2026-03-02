import type { CollectionBeforeChangeHook } from 'payload'
import type { Payload } from 'payload'

import { getArticleNumberPrefixForCategory } from '../articleNumberConfig'

const SEQUENCE_LENGTH = 4
const SEQUENCE_MAX = 10 ** SEQUENCE_LENGTH - 1

/**
 * Get the next free article number for a given category prefix.
 * Format: prefix (3 digits) + sequence (4 digits), e.g. 1010001, 1010002.
 * Excludes the current document when updating so we don't double-assign.
 */
export async function getNextArticleNumber({
  payload,
  prefix,
  currentDocId,
  collection,
  req,
}: {
  payload: Payload
  prefix: number
  currentDocId?: string | number | null
  collection: string
  req: Parameters<CollectionBeforeChangeHook>[0]['req']
}): Promise<string> {
  const prefixStr = String(prefix)
  const where: Record<string, unknown> = {
    articleNumber: {
      like: `${prefixStr}%`,
    },
  }
  if (currentDocId != null) {
    where.id = { not_equals: currentDocId }
  }

  const { docs } = await payload.find({
    collection: collection as 'products',
    where,
    sort: '-articleNumber',
    limit: 1,
    depth: 0,
    req,
  })

  const existing = docs?.[0] as { articleNumber?: string } | undefined
  let nextSequence = 1
  if (existing?.articleNumber) {
    const num = parseInt(existing.articleNumber, 10)
    const base = prefix * 10000
    if (!Number.isNaN(num) && num >= prefix && num <= base + SEQUENCE_MAX) {
      if (num >= base) {
        nextSequence = num - base + 1
      }
    }
  }
  if (nextSequence > SEQUENCE_MAX) {
    nextSequence = SEQUENCE_MAX
  }
  const sequenceStr = String(nextSequence).padStart(SEQUENCE_LENGTH, '0')
  return `${prefixStr}${sequenceStr}`
}

/**
 * BeforeChange hook: assign the next category-based article number when
 * articleNumber is empty and the product has at least one category with a known prefix.
 */
export const assignArticleNumberHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (data?.articleNumber != null && String(data.articleNumber).trim() !== '') {
    return data
  }

  const categoryRefs = data?.categories
  if (!Array.isArray(categoryRefs) || categoryRefs.length === 0) {
    return data
  }

  const firstRef = categoryRefs[0]
  let slugOrTitle: string | null = null
  if (typeof firstRef === 'object' && firstRef !== null) {
    const cat = firstRef as { slug?: string; title?: string }
    slugOrTitle = cat.slug ?? cat.title ?? null
  } else if (typeof firstRef === 'string') {
    try {
      const doc = await req.payload.findByID({
        collection: 'categories',
        id: firstRef,
        depth: 0,
        req,
      })
      const c = doc as { slug?: string; title?: string }
      slugOrTitle = c?.slug ?? c?.title ?? null
    } catch {
      slugOrTitle = null
    }
  }

  if (!slugOrTitle) {
    return data
  }

  const prefix = getArticleNumberPrefixForCategory(slugOrTitle)
  if (prefix == null) {
    return data
  }

  const currentId = operation === 'update' ? data?.id : undefined
  data.articleNumber = await getNextArticleNumber({
    payload: req.payload,
    prefix,
    currentDocId: currentId,
    collection: 'products',
    req,
  })

  return data
}
