import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { Cursor } from '@/components/Cursor'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getRentalTerms } from '@/lib/vehicles/presentation'
import { getAgency, getVehicles } from '@/lib/vehicles/queries'
import './globals.css'

export const dynamic = 'force-dynamic'

// Hébergées avec l'application au build (pas d'appel à Google à la visite). ADR-0022.
const display = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
})
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

// Marque la page « JS actif » avant le premier rendu, pour que les animations d'entrée
// partent de l'état masqué sans clignotement. Sans JavaScript, tout reste visible.
const JS_FLAG = "document.documentElement.classList.add('js')"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Yacine Motors — Location de véhicules à Marseille',
    template: '%s · Yacine Motors',
  },
  description:
    'Yacine Motors, agence de location de véhicules à Marseille : citadines, compactes, SUV et sportives.',
}

// Used only if the database cannot be read: the header and footer still render (pages that need
// data report their own error) instead of the whole site, credits page included, going down.
const FALLBACK_AGENCY = { name: 'Yacine Motors', city: 'Marseille' }

const loadSiteChrome = async () => {
  try {
    const [agency, vehicles] = await Promise.all([getAgency(), getVehicles()])
    return { agency, terms: getRentalTerms(vehicles) }
  } catch (error: unknown) {
    console.error('Site header and footer data unavailable', error)
    return { agency: FALLBACK_AGENCY, terms: null }
  }
}

const Layout = async ({ children }: { children: ReactNode }) => {
  const { agency, terms } = await loadSiteChrome()

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          href="#contenu"
        >
          Aller au contenu
        </a>
        <SiteHeader agencyName={agency.name} city={agency.city} />
        <main id="contenu" tabIndex={-1} className="outline-none">{children}</main>
        <Cursor />
        <SiteFooter agency={agency} terms={terms} />
      </body>
    </html>
  )
}

export default Layout
