import Link from 'next/link'
import {
  SORT_OPTIONS,
  hasActiveFilters,
  type CatalogChoices,
  type CatalogFilters as Filters,
} from '@/lib/vehicles/catalog'

type Props = {
  choices: CatalogChoices
  filters: Filters
}

type SelectProps = {
  id: string
  name: string
  label: string
  value: string | null
  options: readonly { value: string; label: string }[]
  emptyLabel?: string
}

const Select = ({ id, name, label, value, options, emptyLabel }: SelectProps) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} defaultValue={value ?? (emptyLabel ? '' : options[0]?.value)}>
      {emptyLabel ? <option value="">{emptyLabel}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

const asOptions = (values: string[]) => values.map((value) => ({ value, label: value }))

/**
 * Plain GET form: the state lives in the URL (shareable, back button works) and
 * it works without JavaScript. The server re-renders the list on submit.
 */
export const CatalogFilters = ({ choices, filters }: Props) => (
  <form className="mt-4 flex flex-col gap-6 border-t border-ink border-b-line border-b py-6" method="get" action="/vehicules" aria-label="Filtrer et trier le catalogue">
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-5">
      <Select id="f-categorie" name="categorie" label="Catégorie" value={filters.category}
        options={asOptions(choices.categories)} emptyLabel="Toutes" />
      <Select id="f-carburant" name="carburant" label="Carburant" value={filters.fuel}
        options={asOptions(choices.fuels)} emptyLabel="Tous" />
      <Select id="f-boite" name="boite" label="Boîte" value={filters.gearbox}
        options={asOptions(choices.gearboxes)} emptyLabel="Toutes" />
      <div className="field">
        <label htmlFor="f-prix">Prix max. par jour (€)</label>
        <input id="f-prix" name="prixMax" type="number" inputMode="numeric" min={1}
          max={choices.maxPrice} step={5} placeholder={String(choices.maxPrice)}
          defaultValue={filters.maxPrice ?? ''} />
      </div>
      <Select id="f-tri" name="tri" label="Trier par" value={filters.sort} options={SORT_OPTIONS} />
    </div>
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <label className="mr-auto flex items-center gap-2.5 text-sm">
        <input className="size-4 accent-ink" type="checkbox" name="disponibles" value="1" defaultChecked={filters.availableOnly} />
        Disponibles uniquement
      </label>
      <button type="submit" className="button">Appliquer</button>
      {hasActiveFilters(filters) || filters.sort !== 'defaut' ? (
        <Link href="/vehicules" className="text-sm text-steel">Réinitialiser</Link>
      ) : null}
    </div>
  </form>
)
