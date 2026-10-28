import type { Metadata } from 'next'
import Link from 'next/link'
import { EnhancedForm } from '@/components/forms/EnhancedForm'
import { Field } from '@/components/forms/Field'
import { PageNotice } from '@/components/forms/PageNotice'
import { MapEmbed } from '@/components/MapEmbed'
import { getAgency } from '@/lib/vehicles/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Écrivez à Yacine Motors : votre message arrive directement à l’agence.',
}

type ContactPageProps = {
  searchParams: Promise<{ envoye?: string; erreur?: string; sig?: string }>
}

const SUCCESS = 'Merci, votre message a bien été envoyé. Nous vous répondons rapidement.'

const ContactPage = async ({ searchParams }: ContactPageProps) => {
  const { envoye, erreur, sig } = await searchParams
  const agency = await getAgency()
  // Centered on the street address when the agency filled it in, otherwise on the whole city.
  const hasAddress = Boolean(agency.address)
  const mapQuery = hasAddress ? `${agency.address}, ${agency.city}` : agency.city

  return (
    <div className="container-x">
      <header className="page-title">
        <h1>Contact</h1>
        <p>Une question sur un véhicule, une durée, un tarif ? Écrivez-nous, votre message arrive directement à l&apos;agence.</p>
      </header>

      <div className="section-space grid gap-x-16 gap-y-12 lg:grid-cols-2 lg:items-start">
        <section className="max-w-[720px]" aria-label="Formulaire de contact">
          <PageNotice sent={envoye} error={erreur} signature={sig} successMessage={SUCCESS} />
          <EnhancedForm action="/api/contact" submitLabel="Envoyer le message" successMessage={SUCCESS}>
            <Field name="name" label="Nom" required autoComplete="name" maxLength={100} />
            <Field name="email" label="E-mail" type="email" required autoComplete="email" maxLength={254} />
            <Field name="phone" label="Téléphone" type="tel" autoComplete="tel" maxLength={20} />
            <Field name="message" label="Message" type="textarea" required maxLength={2000} />
          </EnhancedForm>
          <p className="mt-4 mb-0 text-sm text-steel">
            Vos données servent uniquement à répondre à votre demande et ne sont pas conservées par le site.{' '}
            <Link href="/confidentialite">Politique de confidentialité</Link>
          </p>
        </section>

        <aside aria-label={`Carte : ${agency.city}`} className="lg:sticky lg:top-28">
          <MapEmbed
            query={mapQuery}
            zoom={hasAddress ? 15 : 12}
            title={`Carte Google Maps : ${mapQuery}`}
            placeName={hasAddress ? "l'agence" : agency.city}
          />
        </aside>
      </div>
    </div>
  )
}

export default ContactPage
