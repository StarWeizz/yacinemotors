'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

const INTERACTIVE = 'a, button, summary, label, select, input, textarea'

/**
 * A thin ring that follows the pointer and widens over links and controls. Only for precise
 * pointers without reduced motion; the native cursor is never hidden, so nothing is lost
 * when this is absent.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ring = ringRef.current
    if (!ring) return
    const media = gsap.matchMedia()
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const moveX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
      const moveY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

      let visible = false
      let lastTarget: EventTarget | null = null

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX)
        moveY(event.clientY)
        if (!visible) {
          visible = true
          gsap.to(ring, { opacity: 1, duration: 0.3, overwrite: 'auto' })
        }
        // Only look at the element under the pointer when it changes, not on every event.
        if (event.target !== lastTarget) {
          lastTarget = event.target
          const target = event.target instanceof Element ? event.target : null
          ring.classList.toggle('is-active', target?.closest(INTERACTIVE) != null)
        }
      }
      const onLeave = () => {
        visible = false
        gsap.to(ring, { opacity: 0, duration: 0.3, overwrite: 'auto' })
      }

      window.addEventListener('pointermove', onMove)
      document.documentElement.addEventListener('pointerleave', onLeave)
      return () => {
        window.removeEventListener('pointermove', onMove)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        gsap.set(ring, { opacity: 0 })
      }
    })
    return () => media.revert()
  })

  return <div ref={ringRef} className="cursor" aria-hidden="true" />
}
