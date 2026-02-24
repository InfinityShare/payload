'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Phone } from 'lucide-react'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <header className="w-full">
      {/* Main Header - Orange masthead with logo section */}
      <div className="header-masthead">
        <div className="container mx-auto flex items-stretch h-full">
          {/* Left: Logo area (dark background) */}
          <div className="flex items-center bg-[#1a1a1a] px-4 py-3 -ml-4 lg:-ml-8">
            <Link href="/" className="flex items-center">
              <LogoIcon className="h-10 w-auto" />
            </Link>
          </div>

          {/* Right: Navigation (orange background) */}
          <div className="flex-1 flex items-center justify-between px-4 lg:px-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {menu.length ? (
                <ul className="flex items-center gap-6 lg:gap-8">
                  {menu.map((item) => (
                    <li key={item.id}>
                      <CMSLink
                        {...item.link}
                        size={'clear'}
                        className={cn(
                          'text-white text-sm font-medium uppercase tracking-wider hover:text-white/80 transition-colors',
                          {
                            'underline underline-offset-4':
                              item.link.url && item.link.url !== '/'
                                ? pathname.includes(item.link.url)
                                : false,
                          },
                        )}
                        appearance="link"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Suspense fallback={null}>
                <MobileMenu menu={menu} />
              </Suspense>
            </div>

            {/* Cart */}
            <div className="flex items-center">
              <Suspense fallback={<OpenCartButton />}>
                <Cart />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header: Breadcrumb + Phone */}
      <div className="bg-[#f5f5f5] dark:bg-[#1a1a1a] border-b border-border">
        <div className="container mx-auto py-3 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Startseite
            </Link>
            {pathname !== '/' && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium">
                  {pathname.split('/').pop()?.replace(/-/g, ' ') || ''}
                </span>
              </>
            )}
          </nav>

          {/* Phone */}
          <div className="flex items-center gap-2 text-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-semibold">+49 1234 5678901</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">Mo-Fr, 8-18 Uhr</span>
          </div>
        </div>
      </div>
    </header>
  )
}
