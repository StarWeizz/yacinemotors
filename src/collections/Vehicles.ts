import type { CollectionConfig } from 'payload'

const CATEGORIES = ['Citadine', 'Compacte', 'SUV', 'Sportive']

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  labels: { singular: 'Véhicule', plural: 'Véhicules' },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['brand', 'model', 'category', 'pricePerDay', 'available'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'Slug (URL)' },
    { name: 'sourceId', type: 'number', unique: true, label: 'ID du fichier source' },
    { name: 'brand', type: 'text', required: true, label: 'Marque' },
    { name: 'model', type: 'text', required: true, label: 'Modèle' },
    { name: 'version', type: 'text', required: true, label: 'Version' },
    { name: 'year', type: 'number', required: true, label: 'Année' },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Catégorie',
      options: CATEGORIES.map((value) => ({ label: value, value })),
    },
    { name: 'fuel', type: 'text', required: true, label: 'Carburant' },
    { name: 'gearbox', type: 'text', required: true, label: 'Boîte' },
    { name: 'powerHp', type: 'number', required: true, label: 'Puissance (ch)' },
    { name: 'drivetrain', type: 'text', required: true, label: 'Transmission' },
    { name: 'mileage', type: 'number', required: true, label: 'Kilométrage' },
    { name: 'seats', type: 'number', required: true, label: 'Places' },
    { name: 'doors', type: 'number', required: true, label: 'Portes' },
    { name: 'color', type: 'text', required: true, label: 'Couleur' },
    { name: 'critAir', type: 'number', required: true, min: 0, max: 5, label: "Crit'Air" },
    { name: 'pricePerDay', type: 'number', required: true, min: 0, label: 'Prix par jour (€)' },
    { name: 'deposit', type: 'number', required: true, min: 0, label: 'Caution (€)' },
    { name: 'includedKmPerDay', type: 'number', required: true, min: 0, label: 'Km inclus par jour' },
    { name: 'available', type: 'checkbox', defaultValue: true, label: 'Disponible' },
    {
      name: 'unavailableUntil',
      type: 'date',
      label: "Indisponible jusqu'au",
      admin: { date: { pickerAppearance: 'dayOnly' }, condition: (data) => data.available === false },
    },
    { name: 'minimumAge', type: 'number', min: 18, label: 'Âge minimum du conducteur' },
    { name: 'minimumLicenseYears', type: 'number', min: 0, label: 'Années de permis minimum' },
    {
      name: 'equipment',
      type: 'array',
      label: 'Équipements',
      fields: [{ name: 'name', type: 'text', required: true, label: 'Équipement' }],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images (chemins)',
      fields: [{ name: 'path', type: 'text', required: true, label: 'Chemin' }],
    },
    { name: 'description', type: 'textarea', required: true, label: 'Description' },
  ],
}
