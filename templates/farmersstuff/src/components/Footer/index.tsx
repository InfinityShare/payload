import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon } from '@/components/icons/logo'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'

  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  return (
    <footer className="bg-background border-t border-border text-muted-foreground">
      <div className="container">
        <div className="flex w-full flex-col gap-6 py-12 text-sm md:flex-row md:gap-12">
          <div>
            <Link className="flex items-center gap-2 text-foreground md:pt-1" href="/">
              <LogoIcon className="w-8 h-auto" />
              <span className="sr-only">{SITE_NAME}</span>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
        </div>
      </div>
      <div className="border-t border-border py-6 text-sm">
        <div className="container mx-auto flex w-full flex-col items-center gap-1 md:flex-row md:gap-0 text-muted-foreground">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-border md:inline-block" />
          <p>Designed for Farmers</p>
          <p className="md:ml-auto">
            <a
              className="text-foreground hover:text-primary transition-colors"
              href="https://payloadcms.com"
            >
              Crafted by Payload
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
