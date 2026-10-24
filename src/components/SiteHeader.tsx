import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          Yacine <span>Motors</span>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          <Link href="/">Accueil</Link>
          <Link href="/vehicules">Catalogue</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
