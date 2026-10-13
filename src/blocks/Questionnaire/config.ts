import type { Block } from 'payload'

export const Questionnaire: Block = {
  slug: 'questionnaire',
  interfaceName: 'QuestionnaireBlock',
  fields: [
    {
      name: 'startingQuestion',
      label: 'Question de départ',
      type: 'relationship',
      relationTo: 'questions',
      required: true,
    },
  ],
  labels: {
    plural: 'Questionnaires',
    singular: 'Questionnaire',
  },
}