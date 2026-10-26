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
    // Coordonnées facultatives : le pied de page n'affiche que celles qui sont renseignées.
    { name: 'address', type: 'text', label: 'Adresse' },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'email', type: 'email', label: 'E-mail public' },
    {
      name: 'openingHours',
      type: 'textarea',
      label: "Horaires d'ouverture",
      admin: { description: 'Une ligne par plage, par exemple : « Lundi – vendredi : 9 h – 19 h ».' },
    },
  ],
}
