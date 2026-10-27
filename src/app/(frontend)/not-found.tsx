import Link from 'next/link'

export const metadata = { title: 'Page introuvable' }

const NotFound = () => (
  <div className="container-x section-space">
    <header className="page-title">
      <h1>Page introuvable</h1>
      <p>Cette adresse ne correspond à aucune page du site. Le véhicule a peut-être été retiré du catalogue.</p>
    </header>
    <div className="flex flex-wrap gap-3">
      <Link className="button" href="/vehicules">
        Voir le catalogue
      </Link>
      <Link className="button button-ghost" href="/">
        Retour à l&apos;accueil
      </Link>
    </div>
  </div>
)

export default NotFound
