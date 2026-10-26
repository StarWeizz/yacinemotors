import type { Metadata } from 'next'
import { PHOTO_CREDITS } from '@/lib/vehicles/photo-credits'

export const metadata: Metadata = {
  title: 'Crédits photos',
  description: 'Auteurs et licences des photos de véhicules présentées sur le site.',
}

const CreditsPage = () => (
  <div className="container-x section-space">
    <header className="page-title">
      <h1>Crédits photos</h1>
      <p>
        Les photos présentent des véhicules du même modèle que ceux proposés, pas les véhicules de
        l&apos;agence eux-mêmes. Elles proviennent de Wikimedia Commons et sont utilisées sous
        licence libre ; merci à leurs auteurs.
      </p>
    </header>

    <ul className="m-0 list-none border-t border-ink p-0">
      {PHOTO_CREDITS.map((credit) => (
        <li
          key={credit.file}
          className="grid gap-x-8 gap-y-1 border-b border-line py-4 text-sm md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
        >
          <span className="font-semibold">{credit.vehicle}</span>
          <span className="text-steel">
            « {credit.title} » par {credit.author},{' '}
            <a href={credit.licenseUrl} rel="noopener noreferrer">
              {credit.license}
            </a>
            ,{' '}
            <a href={credit.source} rel="noopener noreferrer">
              source
            </a>
            . Redimensionnée.
          </span>
        </li>
      ))}
    </ul>
  </div>
)

export default CreditsPage
