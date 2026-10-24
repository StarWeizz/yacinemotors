import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getAgency } from '@/lib/vehicles/queries'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Yacine Motors — Location de véhicules à Marseille',
    template: '%s · Yacine Motors',
  },
  description:
    'Yacine Motors, agence de location de véhicules à Marseille : citadines, compactes, SUV et sportives.',
}

const Layout = async ({ children }: { children: ReactNode }) => {
  const agency = await getAgency()

  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter agencyName={agency.name} city={agency.city} />
      </body>
    </html>
  )
}

export default Layout
