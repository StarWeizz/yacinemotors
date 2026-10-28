'use client'

import { useState } from 'react'

type MapEmbedProps = {
  /** What Google Maps should center on, e.g. "Marseille" or a full address. */
  query: string
  zoom: number
  title: string
  /** Name shown in the privacy notice and on the link. */
  placeName: string
}

/**
 * Google Maps embed that loads only when the visitor asks for it: showing the frame at page load
 * would send their IP address to Google before they chose anything (ADR-0029). Without JavaScript
 * the link to Google Maps still works.
 */
export function MapEmbed({ query, zoom, title, placeName }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const encoded = encodeURIComponent(query)
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&z=${zoom}&hl=fr&output=embed`
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}&hl=fr`

  return (
    <div className="h-[26rem] bg-pearl lg:h-[36rem]">
      {loaded ? (
        <iframe
          title={title}
          src={embedUrl}
          className="size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex size-full flex-col items-start justify-end gap-4 p-6">
          <p className="m-0 max-w-[36ch] text-sm text-steel">
            La carte est fournie par Google Maps. L&apos;afficher transmet votre adresse IP à Google.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="button" className="button hidden js:inline-block" onClick={() => setLoaded(true)}>
              Afficher la carte
            </button>
            <a href={openUrl} target="_blank" rel="noopener noreferrer" className="text-sm">
              Ouvrir {placeName} dans Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
