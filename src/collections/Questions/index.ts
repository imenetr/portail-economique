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
    {
  name: 'answers',
  label: 'Réponses',
  type: 'array',
  required: true,
  minRows: 1,

  fields: [
    {
      name: 'text',
      label: 'Texte de la réponse',
      type: 'text',
      required: true,
    },
    {
      name: 'nextQuestion',
      label: 'Question suivante',
      type: 'relationship',
      relationTo: 'questions',
    },
    {
      name: 'result',
      label: 'Résultat final',
      type: 'relationship',
      relationTo: 'results',
    },
  ],
},
  ],
}