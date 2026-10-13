import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { QuestionnaireBlock as QuestionnaireBlockProps } from '@/payload-types'

import { QuestionnaireClient } from '../../app/(frontend)/questionnaire/QuestionnaireClient'

export async function QuestionnaireBlock(
  props: QuestionnaireBlockProps,
) {
  const { startingQuestion } = props

  const payload = await getPayload({
    config: configPromise,
  })

  const questionId =
    typeof startingQuestion === 'object'
      ? startingQuestion.id
      : startingQuestion

  const question = await payload.findByID({
    collection: 'questions',
    id: questionId,
    depth: 2,
  })

  if (!question) {
    return null
  }

  return <QuestionnaireClient firstQuestion={question} />
}