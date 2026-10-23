import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Yacine Motors — Location de véhicules à Marseille',
  description: 'Agence de location de véhicules à Marseille.',
}

const Layout = ({ children }: { children: ReactNode }) => (
  <html lang="fr">
    <body>{children}</body>
  </html>
)

export default Layout
