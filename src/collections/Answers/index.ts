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
  name: 'nextQuestion',
  label: 'Question suivante',
  type: 'relationship',
  relationTo: 'questions',
},
{
  name: 'recommendation',
  label: 'Recommandation',
  type: 'relationship',
  relationTo: 'recommendations',
},
  ],
}