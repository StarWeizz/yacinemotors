import { notFound } from 'next/navigation'

/**
 * Sends every unknown address to the site's own not-found page, so it keeps the layout
 * (language, landmarks, navigation) instead of Next.js's bare default 404.
 */
const UnknownPage = () => notFound()

export default UnknownPage
