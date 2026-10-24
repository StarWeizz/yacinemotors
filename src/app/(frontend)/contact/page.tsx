import type { Metadata } from 'next'
import { EnhancedForm } from '@/components/forms/EnhancedForm'
import { Field } from '@/components/forms/Field'
import { PageNotice } from '@/components/forms/PageNotice'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Écrivez à Yacine Motors : votre message arrive directement à l’agence.',
}

type ContactPageProps = {
  searchParams: Promise<{ envoye?: string; erreur?: string }>
}

const SUCCESS = 'Merci, votre message a bien été envoyé. Nous vous répondons rapidement.'

const ContactPage = async ({ searchParams }: ContactPageProps) => {
  const { envoye, erreur } = await searchParams

  return (
    <div className="container">
      <header className="page-title">
        <h1>Contact</h1>
        <p>Une question sur un véhicule, une durée, un tarif ? Écrivez-nous, votre message arrive directement à l&apos;agence.</p>
      </header>

      <section className="section form-wrap" aria-label="Formulaire de contact">
        <PageNotice sent={envoye} error={erreur} successMessage={SUCCESS} />
        <EnhancedForm action="/api/contact" submitLabel="Envoyer le message" successMessage={SUCCESS}>
          <Field name="name" label="Nom" required autoComplete="name" maxLength={100} />
          <Field name="email" label="E-mail" type="email" required autoComplete="email" maxLength={254} />
          <Field name="phone" label="Téléphone" type="tel" autoComplete="tel" maxLength={20} />
          <Field name="message" label="Message" type="textarea" required maxLength={2000} />
        </EnhancedForm>
      </section>
    </div>
  )
}

export default ContactPage
