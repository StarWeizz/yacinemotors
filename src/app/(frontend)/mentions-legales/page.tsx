import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Éditeur, hébergement, crédits et propriété intellectuelle de ce site de démonstration.',
}

const MentionsLegalesPage = () => (
  <LegalPage
    title="Mentions légales"
    intro="Ce site est un projet de démonstration : l'agence qu'il présente n'existe pas."
    updated="28 octobre 2026"
  >
    <LegalSection id="demonstration" title="Un site de démonstration">
      <p className="m-0">
        Ce site a été réalisé dans le cadre d&apos;un test technique de développement web. L&apos;agence
        « Yacine Motors », ses véhicules, ses prix, ses cautions et ses conditions de location sont
        fictifs ou donnés à titre d&apos;exemple. Aucune location ne peut être conclue ici et aucune demande
        n&apos;engage une agence réelle.
      </p>
    </LegalSection>

    <LegalSection id="editeur" title="Éditeur et responsable de la publication">
      <p className="m-0">
        Le site est publié, à titre personnel et sans but commercial, par l&apos;auteur du{' '}
        <a href="https://github.com/StarWeizz/yacinemotors" rel="noopener noreferrer">
          dépôt de code public
        </a>{' '}
        (compte GitHub StarWeizz). Il n&apos;est rattaché à aucune société : il n&apos;existe donc ni
        raison sociale, ni numéro d&apos;immatriculation, ni numéro de TVA à indiquer.
      </p>
      <p className="m-0">
        Pour écrire à l&apos;éditeur, utiliser le <Link href="/contact">formulaire de contact</Link>.
      </p>
    </LegalSection>

    <LegalSection id="hebergement" title="Hébergement">
      <p className="m-0">
        Le site n&apos;est pas mis en ligne publiquement : il s&apos;exécute dans des conteneurs Docker, comme
        décrit dans le dépôt de code. Aucun hébergeur n&apos;est donc à mentionner à ce jour.
      </p>
    </LegalSection>

    <LegalSection id="propriete" title="Propriété intellectuelle et crédits">
      <p className="m-0">
        Le code source est consultable sur le dépôt GitHub ci-dessus. Les éléments tiers sont utilisés
        sous licence libre : photographies (Wikimedia Commons, CC BY-SA), polices Newsreader et Inter
        (SIL Open Font License 1.1) et icône du site (Tabler Icons, licence MIT). Les auteurs et les
        licences sont indiqués sur la page <Link href="/credits-photos">Crédits photos</Link>.
      </p>
      <p className="m-0">
        Les marques et noms de modèles de véhicules cités (Audi, BMW, Renault, Mercedes-Benz,
        Volkswagen) appartiennent à leurs propriétaires. Ils ne sont utilisés qu&apos;à titre d&apos;illustration :
        ce site n&apos;a aucun lien avec ces constructeurs.
      </p>
    </LegalSection>

    <LegalSection id="responsabilite" title="Responsabilité">
      <p className="m-0">
        Les informations affichées (disponibilités, tarifs, équipements) sont des exemples et ne
        constituent pas une offre. Les photographies montrent des véhicules du même modèle, pas des
        véhicules appartenant à une agence.
      </p>
    </LegalSection>

    <LegalSection id="donnees" title="Données personnelles">
      <p className="m-0">
        Ce que le site fait des informations saisies dans les formulaires est détaillé dans la{' '}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalSection>
  </LegalPage>
)

export default MentionsLegalesPage
