import type { CollectionConfig } from 'payload'

export const Results: CollectionConfig = {
  slug: 'results',

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      label: 'Titre du résultat',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
  ],
}