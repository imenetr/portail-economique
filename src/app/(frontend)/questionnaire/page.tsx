import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { QuestionnaireClient } from './QuestionnaireClient'

export default async function QuestionnairePage() {
  const payload = await getPayload({
    config: configPromise,
  })

  const questions = await payload.find({
    collection: 'questions',
    where: {
      isStartQuestion: {
        equals: true,
      },
    },
    limit: 1,
    depth: 2,
  })

  const firstQuestion = questions.docs[0]

  if (!firstQuestion) {
    return (
      <main>
        <h1>Aucune question de départ trouvée.</h1>
      </main>
    )
  }

  return <QuestionnaireClient firstQuestion={firstQuestion} />
}