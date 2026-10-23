type SiteFooterProps = {
  agencyName: string
  city: string
}

export function SiteFooter({ agencyName, city }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        © {new Date().getFullYear()} {agencyName} · Location de véhicules à {city}
      </div>
    </footer>
  )
}
