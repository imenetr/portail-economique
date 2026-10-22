import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'slug',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (!data.isStartQuestion) {
          return data
        }

        const existingStartQuestion = await req.payload.find({
          collection: 'questions',
          where: {
            and: [
              {
                isStartQuestion: {
                  equals: true,
                },
              },
              ...(originalDoc?.id
                ? [
                    {
                      id: {
                        not_equals: originalDoc.id,
                      },
                    },
                  ]
                : []),
            ],
          },
          limit: 1,
          depth: 0,
        })

        const previousStartQuestion = existingStartQuestion.docs[0]

        if (previousStartQuestion) {
          await req.payload.update({
            collection: 'questions',
            id: previousStartQuestion.id,
            data: {
              isStartQuestion: false,
            },
            depth: 0,
          })
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Question',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'title',
    }),
    {
      name: 'isStartQuestion',
      label: 'Question de départ',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'answers',
      label: 'Réponses',
      type: 'relationship',
      relationTo: 'answers',
      hasMany: true,
    },
  ],
}