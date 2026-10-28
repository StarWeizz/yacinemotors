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
        Les photos de véhicules présentent des voitures du même modèle que celles proposées, pas les
        véhicules de l&apos;agence eux-mêmes. L&apos;image de l&apos;accueil montre la route des Crêtes,
        entre Cassis et La Ciotat. Toutes proviennent de Wikimedia Commons et sont utilisées sous
        licence libre ; merci à leurs auteurs.
      </p>
    </header>

    <ul className="m-0 list-none border-t border-ink p-0">
      {PHOTO_CREDITS.map((credit) => (
        <li
          key={credit.file}
          className="grid gap-x-8 gap-y-1 border-b border-line py-4 text-sm md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
        >
          <span className="font-semibold">{credit.subject}</span>
          <span className="text-steel">
            « {credit.title} » par {credit.author},{' '}
            <a href={credit.licenseUrl} rel="noopener noreferrer">
              {credit.license}
            </a>
            ,{' '}
            <a href={credit.source} rel="noopener noreferrer" aria-label={`Source de la photo : ${credit.title}`}>
              source
            </a>
            . Redimensionnée.
          </span>
        </li>
      ))}
    </ul>

    <section aria-labelledby="autres-credits" className="mt-14 flex max-w-[70ch] flex-col gap-3 text-sm leading-relaxed">
      <h2 id="autres-credits" className="m-0 text-3xl">
        Autres crédits
      </h2>
      <p className="m-0 text-steel">
        <strong className="font-semibold text-ink">Icône du site</strong> : pictogramme « car » de{' '}
        <a href="https://tabler.io/icons" rel="noopener noreferrer">
          Tabler Icons
        </a>{' '}
        (Paweł Kuna), licence{' '}
        <a href="https://opensource.org/license/mit" rel="noopener noreferrer">
          MIT
        </a>
        .
      </p>
      <p className="m-0 text-steel">
        <strong className="font-semibold text-ink">Polices</strong> : Newsreader et Inter, sous{' '}
        <a href="https://openfontlicense.org" rel="noopener noreferrer">
          SIL Open Font License 1.1
        </a>
        , hébergées sur ce site.
      </p>
    </section>
  </div>
)

export default CreditsPage
