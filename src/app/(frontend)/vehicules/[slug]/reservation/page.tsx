import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EnhancedForm } from '@/components/forms/EnhancedForm'
import { Field } from '@/components/forms/Field'
import { PageNotice } from '@/components/forms/PageNotice'
import { todayInMarseille } from '@/lib/dates'
import { formatKilometers, formatPrice } from '@/lib/format'
import { getAvailabilityLabel, getConditions, getVehicleName } from '@/lib/vehicles/presentation'
import { getVehicleBySlug } from '@/lib/vehicles/queries'

type ReservationPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ envoye?: string; erreur?: string }>
}

export const generateMetadata = async ({ params }: ReservationPageProps): Promise<Metadata> => {
  const vehicle = await getVehicleBySlug((await params).slug)
  return { title: vehicle ? `Réserver ${getVehicleName(vehicle)}` : 'Réservation' }
}

const SUCCESS =
  'Merci, votre demande de réservation a bien été envoyée. Nous revenons vers vous pour la confirmer.'

const ReservationPage = async ({ params, searchParams }: ReservationPageProps) => {
  const { slug } = await params
  const { envoye, erreur } = await searchParams
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const conditions = getConditions(vehicle)
  const bookable = vehicle.available !== false || Boolean(vehicle.unavailableUntil)

  return (
    <div className="container">
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

      <div className="section reservation">
        <aside className="summary" aria-label="Véhicule demandé">
          <h2>{getVehicleName(vehicle)}</h2>
          <p className="card__version">
            {vehicle.version} · {vehicle.year}
          </p>
          <p>
            <span className={`badge ${vehicle.available ? 'badge--ok' : 'badge--off'}`}>
              {getAvailabilityLabel(vehicle)}
            </span>
          </p>
          <p className="price">
            <strong>{formatPrice(vehicle.pricePerDay)}</strong>
            <small>/ jour</small>
          </p>
          <p className="terms">
            {formatKilometers(vehicle.includedKmPerDay)} inclus par jour · Caution{' '}
            {formatPrice(vehicle.deposit)}
          </p>
          {conditions.length > 0 && (
            <ul className="conditions" aria-label="Conditions de location">
              {conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          )}
        </aside>

        <section className="form-wrap" aria-label="Formulaire de réservation">
          <PageNotice sent={envoye} error={erreur} successMessage={SUCCESS} />
          {bookable ? (
            <EnhancedForm action="/api/reservation" submitLabel="Envoyer la demande" successMessage={SUCCESS}>
              <input type="hidden" name="vehicleSlug" value={vehicle.slug} />
              <div className="field-row">
                <Field name="startDate" label="Départ" type="date" required min={todayInMarseille()} />
                <Field name="endDate" label="Retour" type="date" required min={todayInMarseille()} />
              </div>
              <Field name="name" label="Nom" required autoComplete="name" maxLength={100} />
              <div className="field-row">
                <Field name="email" label="E-mail" type="email" required autoComplete="email" maxLength={254} />
                <Field name="phone" label="Téléphone" type="tel" required autoComplete="tel" maxLength={20} />
              </div>
              <div className="field-row">
                <Field name="driverAge" label="Âge du conducteur" type="number" required min={18} max={99} />
                <Field name="licenseYears" label="Années de permis" type="number" required min={0} max={80} />
              </div>
              <Field name="message" label="Message" type="textarea" rows={3} maxLength={1000} />
            </EnhancedForm>
          ) : (
            <p className="notice notice--error">
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
