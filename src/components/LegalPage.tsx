import type { ReactNode } from 'react'

type LegalPageProps = {
  title: string
  intro: string
  updated: string
  children: ReactNode
}

export function LegalPage({ title, intro, updated, children }: LegalPageProps) {
  return (
    <div className="container-x section-space">
      <header className="page-title">
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="flex max-w-[70ch] flex-col gap-10 leading-relaxed">{children}</div>
      <p className="mt-14 mb-0 text-sm text-steel">Dernière mise à jour : {updated}</p>
    </div>
  )
}

type LegalSectionProps = {
  id: string
  title: string
  children: ReactNode
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 border-t border-line pt-6">
      <h2 id={id} className="m-0 text-3xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
