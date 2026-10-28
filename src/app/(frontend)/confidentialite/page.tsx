import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Quelles données les formulaires collectent, où elles vont, combien de temps et comment exercer vos droits.',
}

const ConfidentialitePage = () => (
  <LegalPage
    title="Politique de confidentialité"
    intro="Les formulaires envoient votre message par Telegram et ne le conservent nulle part sur le site. Ce site est une démonstration : n'y saisissez pas de données réelles sensibles."
    updated="28 octobre 2026"
  >
    <LegalSection id="responsable" title="Qui est responsable">
      <p className="m-0">
        Le responsable du traitement est l&apos;éditeur du site, présenté dans les{' '}
        <Link href="/mentions-legales">mentions légales</Link>. Ce document décrit le fonctionnement réel
        du code de ce projet de démonstration.
      </p>
    </LegalSection>

    <LegalSection id="donnees" title="Quelles données, pour quoi faire">
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        <li>
          <strong>Formulaire de contact</strong> : nom, adresse e-mail, téléphone (facultatif) et
          message. Elles servent à répondre à votre message.
        </li>
        <li>
          <strong>Demande de réservation</strong> : nom, e-mail, téléphone, dates de départ et de
          retour, âge du conducteur, années de permis, message facultatif et véhicule choisi. Elles
          servent à vérifier que la demande respecte les conditions du véhicule et à y répondre.
        </li>
      </ul>
      <p className="m-0">
        Le traitement repose sur votre démarche : vous envoyez volontairement le formulaire pour être
        recontacté. Rien n&apos;est collecté sans que vous l&apos;envoyiez.
      </p>
    </LegalSection>

    <LegalSection id="destinataires" title="Où vont vos données">
      <p className="m-0">
        À l&apos;envoi, le serveur transmet votre message au service de messagerie <strong>Telegram</strong>,
        qui le dépose dans la conversation de l&apos;éditeur. Telegram est un service tiers dont les
        serveurs peuvent se trouver hors de l&apos;Union européenne ; il applique sa propre politique de
        confidentialité.
      </p>
      <p className="m-0">
        Le site <strong>n&apos;enregistre votre message dans aucune base de données ni aucun fichier</strong>.
        Si l&apos;envoi à Telegram échoue, la demande est perdue et le site vous en avertit.
      </p>
    </LegalSection>

    <LegalSection id="duree" title="Combien de temps">
      <p className="m-0">
        Le site ne conserve rien. Le message reste dans la conversation Telegram de l&apos;éditeur jusqu&apos;à
        ce que celui-ci le supprime.
      </p>
    </LegalSection>

    <LegalSection id="journaux" title="Journaux techniques">
      <p className="m-0">
        Comme tout serveur web, celui du site peut journaliser l&apos;adresse IP, la date et l&apos;adresse
        demandée. Ces journaux servent à la sécurité et à la limitation du nombre d&apos;envois (anti-spam) ;
        ils restent dans les journaux des conteneurs et ne sont pas exploités autrement.
      </p>
    </LegalSection>

    <LegalSection id="cookies" title="Cookies et traceurs">
      <p className="m-0">
        Le site ne dépose <strong>aucun cookie</strong> chez les visiteurs et n&apos;utilise ni mesure
        d&apos;audience ni publicité. Un cookie technique de session n&apos;est créé que pour la connexion à
        l&apos;espace d&apos;administration, réservé au gérant. Les polices sont hébergées sur le site.
      </p>
    </LegalSection>

    <LegalSection id="carte" title="Carte Google Maps">
      <p className="m-0">
        La carte de la page <Link href="/contact">Contact</Link> n&apos;est chargée qu&apos;après un clic sur
        « Afficher la carte ». À ce moment, votre navigateur contacte Google, qui reçoit votre adresse IP
        et peut déposer ses propres cookies, selon sa politique de confidentialité. Tant que vous ne
        cliquez pas, rien n&apos;est envoyé à Google. Le lien « Ouvrir dans Google Maps » n&apos;envoie rien
        non plus avant que vous le suiviez.
      </p>
    </LegalSection>

    <LegalSection id="droits" title="Vos droits">
      <p className="m-0">
        Vous pouvez demander l&apos;accès à vos données, leur rectification, leur effacement, la limitation
        ou l&apos;opposition à leur traitement, ainsi que leur portabilité. Pour cela, écrivez via le{' '}
        <Link href="/contact">formulaire de contact</Link> en précisant votre demande ; l&apos;éditeur supprimera
        le message concerné de sa conversation Telegram. Vous pouvez aussi introduire une réclamation
        auprès de la{' '}
        <a href="https://www.cnil.fr" rel="noopener noreferrer">
          CNIL
        </a>
        .
      </p>
    </LegalSection>

    <LegalSection id="securite" title="Sécurité">
      <p className="m-0">
        Le jeton du service de messagerie reste sur le serveur et n&apos;est jamais envoyé à votre
        navigateur. Les formulaires sont protégés contre le spam et les envois forgés. Les échanges sont
        chiffrés dès que le site est servi en HTTPS (ce qui n&apos;est pas le cas d&apos;une exécution locale).
      </p>
    </LegalSection>
  </LegalPage>
)

export default ConfidentialitePage
