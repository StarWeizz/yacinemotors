'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type ReactNode } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type RevealProps = {
  children: ReactNode
  className?: string
}

/**
 * Progressive enhancement (ADR-0014): the content is server-rendered and visible without
 * JavaScript. Once hydrated, elements marked `data-reveal` are unveiled from the top edge as they scroll into view,
 * unless the visitor prefers reduced motion.
 */
export function Reveal({ children, className }: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', containerRef.current)
        gsap.set(items, { opacity: 0, clipPath: 'inset(14% 0 0 0)' })
        ScrollTrigger.batch(items, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.1,
              stagger: 0.12,
              ease: 'expo.out',
              clearProps: 'clipPath',
            }),
        })
      })
      return () => media.revert()
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
