'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

type HeroTitleProps = {
  text: string
}

/**
 * The title is server-rendered word by word. With JavaScript and no reduced-motion preference,
 * the words rise out of their mask one after the other (the start state is set with the `js` variant
 * in the markup). Otherwise the text is simply there.
 */
export function HeroTitle({ text }: HeroTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.hero-word__inner', {
          y: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: 'expo.out',
          delay: 0.15,
        })
      })
      return () => media.revert()
    },
    { scope: ref },
  )

  return (
    <h1 ref={ref} className="mb-[0.45em] text-display leading-[0.98] tracking-[-0.025em]">
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="hero-word">
            <span className="hero-word__inner motion-safe:js:translate-y-[108%]">{word}</span>
          </span>{' '}
        </span>
      ))}
    </h1>
  )
}
