import type { CollectionConfig } from 'payload'

export const Answers: CollectionConfig = {
  slug: 'answers',
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      label: 'Texte de la réponse',
      type: 'text',
      required: true,
    },
    {
      name: 'question',
      label: 'Question',
      type: 'relationship',
      relationTo: 'questions',
      required: true,
    },
    {
      name: 'destinationType',
      label: 'Destination',
      type: 'radio',
      required: true,
      defaultValue: 'question',
      options: [
        {
          label: 'Question suivante',
          value: 'question',
        },
        {
          label: 'Recommandation',
          value: 'recommendation',
        },
      ],
    },
    {
      name: 'nextQuestion',
      label: 'Question suivante',
      type: 'relationship',
      relationTo: 'questions',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.destinationType === 'question',
      },
    },
    {
      name: 'recommendation',
      label: 'Recommandation',
      type: 'relationship',
      relationTo: 'recommendations',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.destinationType === 'recommendation',
      },
    },
  ],
}