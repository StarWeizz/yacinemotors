import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper">
      <div className="container-x flex items-baseline justify-between gap-4 py-4">
        <Link href="/" className="font-serif text-2xl leading-none font-medium tracking-[0.01em] no-underline">
          Yacine Motors
        </Link>
        <nav className="flex gap-[clamp(1rem,3vw,2.25rem)] text-sm" aria-label="Navigation principale">
          <Link href="/" className="nav-link py-1 text-steel no-underline hover:text-ink focus-visible:text-ink">
            Accueil
          </Link>
          <Link href="/vehicules" className="nav-link py-1 text-steel no-underline hover:text-ink focus-visible:text-ink">
            Catalogue
          </Link>
          <Link href="/contact" className="nav-link py-1 text-steel no-underline hover:text-ink focus-visible:text-ink">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
