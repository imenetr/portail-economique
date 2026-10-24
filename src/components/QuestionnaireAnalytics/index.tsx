import type { WidgetServerProps } from 'payload'

type CountItem = {
  label: string
  count: number
}

function getRelationLabel(
  relation: unknown,
  field: 'text' | 'title',
): string | null {
  if (!relation) return null

  if (typeof relation === 'object' && relation !== null && field in relation) {
    const value = (relation as Record<string, unknown>)[field]
    return typeof value === 'string' ? value : null
  }

  if (typeof relation === 'string') {
    return relation
  }

  return null
}

export default async function QuestionnaireAnalytics({
  req,
}: WidgetServerProps) {
  const { payload } = req

  const result = await payload.find({
    collection: 'questionnaire-events',
    limit: 1000,
    depth: 1,
    sort: 'createdAt',
  })

  const events = result.docs

  const startedSessions = new Set<string>()
  const completedSessions = new Set<string>()

  const answerCounts = new Map<string, CountItem>()
  const recommendationCounts = new Map<string, CountItem>()
  const pathCounts = new Map<string, CountItem>()

  const sessionAnswers = new Map<
    string,
    Array<{ sequence: number; label: string }>
  >()

  let totalAnswers = 0

  for (const event of events) {
    if (event.eventType === 'start') {
      startedSessions.add(event.sessionId)
    }

    if (event.eventType === 'complete') {
      completedSessions.add(event.sessionId)
    }

    if (event.eventType === 'answer') {
      totalAnswers += 1

      const label =
        getRelationLabel(event.answer, 'text') ?? 'Réponse inconnue'

      const existing = answerCounts.get(label)

      answerCounts.set(label, {
        label,
        count: (existing?.count ?? 0) + 1,
      })

      const answers = sessionAnswers.get(event.sessionId) ?? []

      answers.push({
        sequence: event.sequence,
        label,
      })

      sessionAnswers.set(event.sessionId, answers)
    }

    if (event.eventType === 'complete' && event.recommendation) {
      const label =
        getRelationLabel(event.recommendation, 'title') ??
        'Recommandation inconnue'

      const existing = recommendationCounts.get(label)

      recommendationCounts.set(label, {
        label,
        count: (existing?.count ?? 0) + 1,
      })
    }
  }

  for (const answers of sessionAnswers.values()) {
    answers.sort((a, b) => a.sequence - b.sequence)

    if (answers.length === 0) continue

    const path = answers.map((answer) => answer.label).join(' → ')

    const existing = pathCounts.get(path)

    pathCounts.set(path, {
      label: path,
      count: (existing?.count ?? 0) + 1,
    })
  }

  const sessionsStarted = startedSessions.size
  const sessionsCompleted = completedSessions.size

  const completionRate =
    sessionsStarted > 0
      ? Math.round((sessionsCompleted / sessionsStarted) * 100)
      : 0

  const abandonmentRate =
    sessionsStarted > 0
      ? Math.round(
          ((sessionsStarted - sessionsCompleted) / sessionsStarted) * 100,
        )
      : 0

  const topAnswers = Array.from(answerCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topRecommendations = Array.from(recommendationCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topPaths = Array.from(pathCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div
      style={{
        height: '100%',
        padding: '1.5rem',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '8px',
        background: 'var(--theme-bg)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Questionnaire Analytics</h3>
          <p
            style={{
              margin: '0.35rem 0 0',
              color: 'var(--theme-elevation-500)',
            }}
          >
            Données enregistrées dans Payload
          </p>
        </div>

        <strong>{events.length} événements</strong>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Sessions démarrées
          </div>
          <strong style={{ fontSize: '2rem' }}>{sessionsStarted}</strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Sessions terminées
          </div>
          <strong style={{ fontSize: '2rem' }}>{sessionsCompleted}</strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Taux de complétion
          </div>
          <strong style={{ fontSize: '2rem' }}>{completionRate}%</strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Taux d&apos;abandon
          </div>
          <strong style={{ fontSize: '2rem' }}>{abandonmentRate}%</strong>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '2rem',
        }}
      >
        <section>
          <h4>Réponses les plus fréquentes</h4>

          {topAnswers.length === 0 ? (
            <p style={{ color: 'var(--theme-elevation-500)' }}>
              Aucune réponse enregistrée.
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {topAnswers.map((item) => (
                <li key={item.label} style={{ marginBottom: '0.5rem' }}>
                  {item.label} — <strong>{item.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h4>Recommandations les plus proposées</h4>

          {topRecommendations.length === 0 ? (
            <p style={{ color: 'var(--theme-elevation-500)' }}>
              Aucune recommandation enregistrée.
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {topRecommendations.map((item) => (
                <li key={item.label} style={{ marginBottom: '0.5rem' }}>
                  {item.label} — <strong>{item.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h4>Parcours les plus fréquents</h4>

        {topPaths.length === 0 ? (
          <p style={{ color: 'var(--theme-elevation-500)' }}>
            Aucun parcours enregistré.
          </p>
        ) : (
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {topPaths.map((item) => (
              <li key={item.label} style={{ marginBottom: '0.75rem' }}>
                <span>{item.label}</span>{' '}
                <strong>({item.count} session(s))</strong>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--theme-elevation-150)',
          color: 'var(--theme-elevation-500)',
        }}
      >
        {totalAnswers} réponse(s) enregistrée(s)
      </div>
    </div>
  )
}