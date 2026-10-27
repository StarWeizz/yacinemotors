import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PriceAmount } from '@/components/PriceAmount'
import { AvailabilityBadge } from '@/components/AvailabilityBadge'
import { EnhancedForm } from '@/components/forms/EnhancedForm'
import { Field } from '@/components/forms/Field'
import { PageNotice } from '@/components/forms/PageNotice'
import { todayInMarseille } from '@/lib/dates'
import { formatKilometers, formatPrice } from '@/lib/format'
import { getConditions, getVehicleName, isAvailable } from '@/lib/vehicles/presentation'
import { getVehicleBySlug } from '@/lib/vehicles/queries'

type ReservationPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ envoye?: string; erreur?: string; sig?: string }>
}

export const generateMetadata = async ({ params }: ReservationPageProps): Promise<Metadata> => {
  const vehicle = await getVehicleBySlug((await params).slug)
  return { title: vehicle ? `Réserver ${getVehicleName(vehicle)}` : 'Réservation' }
}

const SUCCESS =
  'Merci, votre demande de réservation a bien été envoyée. Nous revenons vers vous pour la confirmer.'

const ReservationPage = async ({ params, searchParams }: ReservationPageProps) => {
  const { slug } = await params
  const { envoye, erreur, sig } = await searchParams
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const conditions = getConditions(vehicle)
  const bookable = isAvailable(vehicle) || Boolean(vehicle.unavailableUntil)

  return (
    <div className="container-x">
      <header className="page-title">
        <p>
          <Link href="/vehicules">← Retour au catalogue</Link>
        </p>
        <h1>Demander une réservation</h1>
        <p>
          Ceci est une <strong>demande</strong> : elle n&apos;est confirmée qu&apos;après réponse de
          l&apos;agence.
        </p>
      </header>

      <div className="section-space grid items-start gap-[clamp(2rem,5vw,4rem)] md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-3 bg-pearl p-6" aria-label="Véhicule demandé">
          <h2 className="m-0 text-3xl">{getVehicleName(vehicle)}</h2>
          <p className="m-0 text-sm">
            <Link href={`/vehicules/${encodeURIComponent(vehicle.slug)}`}>Voir la fiche du véhicule</Link>
          </p>
          <p className="m-0 text-sm text-steel">
            {vehicle.version} · {vehicle.year}
          </p>
          <p className="m-0">
            <AvailabilityBadge vehicle={vehicle} />
          </p>
          <p className="m-0 flex flex-wrap items-baseline gap-2">
            <PriceAmount euros={vehicle.pricePerDay} />
            <small className="text-sm text-steel">/ jour</small>
          </p>
          <p className="m-0 text-sm text-steel">
            {formatKilometers(vehicle.includedKmPerDay)} inclus par jour · Caution{' '}
            {formatPrice(vehicle.deposit)}
          </p>
          {conditions.length > 0 && (
            <ul className="m-0 list-none border-l border-ink py-3 pl-4 text-sm" aria-label="Conditions de location">
              {conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          )}
        </aside>

        <section aria-label="Formulaire de réservation">
          <PageNotice sent={envoye} error={erreur} signature={sig} successMessage={SUCCESS} />
          {bookable ? (
            <EnhancedForm action="/api/reservation" submitLabel="Envoyer la demande" successMessage={SUCCESS}>
              <input type="hidden" name="vehicleSlug" value={vehicle.slug} />
              <div className="flex flex-wrap gap-5 *:min-w-[180px]">
                <Field name="startDate" label="Départ" type="date" required min={todayInMarseille()} />
                <Field name="endDate" label="Retour" type="date" required min={todayInMarseille()} />
              </div>
              <Field name="name" label="Nom" required autoComplete="name" maxLength={100} />
              <div className="flex flex-wrap gap-5 *:min-w-[180px]">
                <Field name="email" label="E-mail" type="email" required autoComplete="email" maxLength={254} />
                <Field name="phone" label="Téléphone" type="tel" required autoComplete="tel" maxLength={20} />
              </div>
              <div className="flex flex-wrap gap-5 *:min-w-[180px]">
                <Field name="driverAge" label="Âge du conducteur" type="number" required min={18} max={99} />
                <Field name="licenseYears" label="Années de permis" type="number" required min={0} max={80} />
              </div>
              <Field name="message" label="Message" type="textarea" rows={3} maxLength={1000} />
            </EnhancedForm>
          ) : (
            <p className="notice notice-error">
              Ce véhicule n&apos;est pas disponible actuellement. <Link href="/contact">Contactez-nous</Link>{' '}
              pour connaître les prochaines disponibilités.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default ReservationPage
