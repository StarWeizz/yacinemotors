import Link from 'next/link'
import type { Agency } from '@/payload-types'
import { formatKilometers, formatPrice } from '@/lib/format'
import type { RentalTerms } from '@/lib/vehicles/presentation'

type SiteFooterProps = {
  agency: Pick<Agency, 'name' | 'city' | 'address' | 'phone' | 'email' | 'openingHours'>
  terms: RentalTerms | null
}

const linkClass = 'text-steel-light no-underline hover:text-paper focus-visible:text-paper'
const headingClass = 'mb-4 font-sans text-sm font-semibold text-paper'

const range = ([low, high]: [number, number], format: (value: number) => string): string =>
  low === high ? format(low) : `de ${format(low)} à ${format(high)}`

export function SiteFooter({ agency, terms }: SiteFooterProps) {
  const hours = agency.openingHours?.split('\n').filter((line) => line.trim() !== '') ?? []
  const hasContact = Boolean(agency.address || agency.phone || agency.email || hours.length > 0)

  return (
    <footer className="on-dark bg-ink text-sm text-steel-light">
      <div className="container-x grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <p className="m-0 font-serif text-3xl leading-none font-medium text-paper">{agency.name}</p>
          <p className="mt-4 mb-0 max-w-[32ch] leading-relaxed">
            Location de citadines, compactes, SUV et sportives à {agency.city}. Prix par jour,
            caution et kilomètres annoncés avant toute demande.
          </p>
          <p className="mt-6 mb-0 text-[0.8rem]">{agency.city} · 43°17′ N, 5°22′ E</p>
        </div>

        <nav aria-label="Pied de page">
          <h2 className={headingClass}>Le site</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            <li><Link className={linkClass} href="/">Accueil</Link></li>
            <li><Link className={linkClass} href="/vehicules">Catalogue</Link></li>
            <li><Link className={linkClass} href="/vehicules?disponibles=1">Véhicules disponibles</Link></li>
            <li><Link className={linkClass} href="/contact">Contact</Link></li>
          </ul>
        </nav>

        {terms && (
          <div>
            <h2 className={headingClass}>Conditions de location</h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 leading-snug">
              <li>Caution {range(terms.depositRange, formatPrice)} selon le véhicule</li>
              <li>{range(terms.kmRange, formatKilometers)} inclus par jour</li>
              {terms.maxMinimumAge !== null && (
                <li>Âge minimum du conducteur : jusqu&apos;à {terms.maxMinimumAge} ans selon le véhicule</li>
              )}
              {terms.maxMinimumLicenseYears !== null && (
                <li>Jusqu&apos;à {terms.maxMinimumLicenseYears} ans de permis exigés selon le véhicule</li>
              )}
              <li>Une demande de réservation est confirmée après réponse de l&apos;agence</li>
            </ul>
          </div>
        )}

        <div>
          <h2 className={headingClass}>Nous contacter</h2>
          <address className="m-0 flex flex-col gap-2.5 not-italic leading-snug">
            {agency.address && <span>{agency.address}</span>}
            {agency.phone && (
              <a className={linkClass} href={`tel:${agency.phone.replace(/[^\d+]/g, '')}`}>
                {agency.phone}
              </a>
            )}
            {agency.email && (
              <a className={linkClass} href={`mailto:${agency.email}`}>
                {agency.email}
              </a>
            )}
            {hours.length > 0 && (
              <span className="flex flex-col gap-1">
                {hours.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            )}
            {!hasContact && <span>Écrivez-nous depuis le formulaire : votre message arrive directement à l&apos;agence.</span>}
          </address>
          <Link className="button button-light mt-6" href="/contact">
            Écrire à l&apos;agence
          </Link>
        </div>
      </div>

      <div className="border-t border-graphite">
        <div className="container-x flex flex-wrap justify-between gap-x-8 gap-y-2 py-6 text-[0.8rem]">
          <p className="m-0">
            © {new Date().getFullYear()} {agency.name}. Tous droits réservés.
          </p>
          <p className="m-0">
            <Link className={linkClass} href="/credits-photos">
              Crédits photos
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
