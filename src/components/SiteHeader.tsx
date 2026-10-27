'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/vehicules', label: 'Catalogue' },
  { href: '/contact', label: 'Contact' },
] as const

type SiteHeaderProps = {
  agencyName: string
  city: string
}

const isActive = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)

/**
 * On the home page the header sits over the hero image (light text, not sticky); elsewhere it is
 * a plain sticky white bar. The current page is marked with the same filled dot as an available
 * vehicle, and the primary action stays one click away.
 */
export function SiteHeader({ agencyName, city }: SiteHeaderProps) {
  const pathname = usePathname()
  const overHero = pathname === '/'

  return (
    <header
      className={
        overHero
          ? 'on-dark absolute inset-x-0 top-0 z-10 text-paper'
          : 'sticky top-0 z-10 border-b border-line bg-paper text-ink'
      }
    >
      <div className="container-x flex items-center justify-between gap-6 py-5">
        <Link href="/" className="flex items-baseline gap-3 no-underline" aria-label={`${agencyName}, accueil`}>
          <span className="font-serif text-2xl leading-none font-medium tracking-[0.01em]">{agencyName}</span>
          <span
            className={`hidden border-l pl-3 text-sm leading-none sm:inline ${overHero ? 'border-paper/40 text-paper/75' : 'border-line text-steel'}`}
          >
            {city}
          </span>
        </Link>

        <div className="flex items-center gap-[clamp(1rem,3vw,2.5rem)]">
          <nav className="flex gap-[clamp(1rem,2.5vw,2rem)] text-sm" aria-label="Navigation principale">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center gap-2 py-1 no-underline transition-colors ${
                    overHero
                      ? 'text-paper/75 hover:text-paper focus-visible:text-paper aria-[current=page]:text-paper'
                      : 'text-steel hover:text-ink focus-visible:text-ink aria-[current=page]:text-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-[0.45rem] rounded-full border border-current transition-colors ${
                      active ? 'bg-current' : 'bg-transparent opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <Link
            href="/vehicules?disponibles=1"
            className={`button hidden px-5 py-3 md:inline-block ${overHero ? 'button-light' : ''}`}
          >
            Voir les véhicules disponibles
          </Link>
        </div>
      </div>
    </header>
  )
}
