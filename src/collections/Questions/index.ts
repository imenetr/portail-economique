import type { CollectionConfig } from 'payload'

export const Questions: CollectionConfig = {
  slug: 'questions',

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      label: 'Question',
      type: 'text',
      required: true,
    },
    {
      name: 'isStartQuestion',
      label: 'Question de départ',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}