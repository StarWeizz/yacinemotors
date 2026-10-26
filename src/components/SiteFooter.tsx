type SiteFooterProps = {
  agencyName: string
  city: string
}

export function SiteFooter({ agencyName, city }: SiteFooterProps) {
  return (
    <footer className="border-t border-line py-8 text-sm text-steel">
      <div className="container-x flex flex-wrap justify-between gap-x-8 gap-y-3">
        <p className="m-0">
          © {new Date().getFullYear()} {agencyName}
        </p>
        <p className="m-0">Location de véhicules à {city}</p>
      </div>
    </footer>
  )
}
