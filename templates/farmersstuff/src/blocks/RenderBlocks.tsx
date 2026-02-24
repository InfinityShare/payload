import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ChecklistBlockComponent } from '@/blocks/Checklist/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { IconFeaturesBlockComponent } from '@/blocks/IconFeatures/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { QuickSpecsBlockComponent } from '@/blocks/QuickSpecs/Component'
import { TechSpecsBlockComponent } from '@/blocks/TechSpecs/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { YoutubeBlockComponent } from '@/blocks/Youtube/Component'
import { cn } from '@/utilities/cn'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page, Product } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  checklist: ChecklistBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  iconFeatures: IconFeaturesBlockComponent,
  mediaBlock: MediaBlock,
  quickSpecs: QuickSpecsBlockComponent,
  techSpecs: TechSpecsBlockComponent,
  threeItemGrid: ThreeItemGridBlock,
  youtube: YoutubeBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  product?: Product
}> = (props) => {
  const { blocks, product } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block
          const fullWidth = (block as Record<string, unknown>).fullWidth as boolean | undefined

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={cn('my-16', {
                    container: !fullWidth,
                  })}
                  key={index}
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block
                    id={toKebabCase(blockName!)}
                    {...block}
                    fullWidth={fullWidth}
                    product={product}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
