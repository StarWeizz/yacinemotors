import { formatPrice } from '@/lib/format'

type PriceAmountProps = {
  euros: number
}

/** The amount in the serif face, the currency sign in the sans, slightly smaller. */
export function PriceAmount({ euros }: PriceAmountProps) {
  const amount = formatPrice(euros).replace(/[\s\u00a0\u202f]*€$/, '')
  return (
    <strong className="font-serif text-4xl leading-none font-medium">
      {amount}
      <span className="ml-1 font-sans text-[0.5em] font-normal">€</span>
    </strong>
  )
}
