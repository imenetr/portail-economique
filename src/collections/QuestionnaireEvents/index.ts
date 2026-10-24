import type { CollectionConfig } from 'payload'

export const QuestionnaireEvents: CollectionConfig = {
  slug: 'questionnaire-events',

  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['sessionId', 'eventType', 'createdAt'],
  },

  defaultSort: '-createdAt',

  indexes: [
    {
      fields: ['sessionId', 'createdAt'],
    },
  ],

  fields: [
    {
      name: 'sessionId',
      label: 'Session',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'eventType',
      label: 'Type d’événement',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Démarrage',
          value: 'start',
        },
        {
          label: 'Réponse',
          value: 'answer',
        },
        {
          label: 'Retour',
          value: 'back',
        },
        {
          label: 'Réinitialisation',
          value: 'reset',
        },
        {
          label: 'Terminé',
          value: 'complete',
        },
      ],
    },
    {
      name: 'question',
      label: 'Question',
      type: 'relationship',
      relationTo: 'questions',
    },
    {
      name: 'answer',
      label: 'Réponse',
      type: 'relationship',
      relationTo: 'answers',
    },
    {
      name: 'recommendation',
      label: 'Recommandation',
      type: 'relationship',
      relationTo: 'recommendations',
    },
    {
      name: 'sequence',
      label: 'Ordre',
      type: 'number',
      required: true,
    },
  ],
}