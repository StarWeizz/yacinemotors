import type { Metadata } from 'next'
import { Bodoni_Moda, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { Cursor } from '@/components/Cursor'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getAgency } from '@/lib/vehicles/queries'
import './globals.css'

export const dynamic = 'force-dynamic'

// Hébergées avec l'application au build (pas d'appel à Google à la visite). ADR-0022.
const display = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
})
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

// Marque la page « JS actif » avant le premier rendu, pour que les animations d'entrée
// partent de l'état masqué sans clignotement. Sans JavaScript, tout reste visible.
const JS_FLAG = "document.documentElement.classList.add('js')"

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
    <html lang="fr" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          href="#contenu"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <Cursor />
        <SiteFooter agencyName={agency.name} city={agency.city} />
      </body>
    </html>
  )
}

export default Layout
