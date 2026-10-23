import type { GlobalConfig } from 'payload'

export const Agency: GlobalConfig = {
  slug: 'agency',
  label: 'Agence',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom' },
    { name: 'city', type: 'text', required: true, label: 'Ville' },
    { name: 'currency', type: 'text', required: true, defaultValue: 'EUR', label: 'Devise' },
  ],
}
