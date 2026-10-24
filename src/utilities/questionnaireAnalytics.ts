export type QuestionnaireEventType =
  | 'start'
  | 'answer'
  | 'back'
  | 'reset'
  | 'complete'

type TrackQuestionnaireEventInput = {
  sessionId: string
  eventType: QuestionnaireEventType
  sequence: number
  question?: string
  answer?: string
  recommendation?: string
}

export function trackQuestionnaireEvent({
  sessionId,
  eventType,
  sequence,
  question,
  answer,
  recommendation,
}: TrackQuestionnaireEventInput) {
  void fetch('/api/questionnaire-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      eventType,
      sequence,
      question,
      answer,
      recommendation,
    }),
  }).catch(() => {
    // Analytics must never block or break the questionnaire.
  })
}