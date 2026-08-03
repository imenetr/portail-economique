import type { CollectionConfig } from 'payload'

export const Recommendations: CollectionConfig = {
  slug: 'recommendations',

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'website',
      label: 'Site web',
      type: 'text',
    },
    {
  name: 'partners',
  label: 'Partenaires',
  type: 'array',
  fields: [
    {
      name: 'name',
      label: 'Nom du partenaire',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      label: 'Site web',
      type: 'text',
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
},
  ],
}