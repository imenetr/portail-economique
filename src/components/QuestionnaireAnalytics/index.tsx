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

function getTunisDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Tunis',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  }
}

function getDateKey(date: Date) {
  const { year, month, day } = getTunisDateParts(date)

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`
}

function getLastSevenDateKeys() {
  const today = getTunisDateParts(new Date())
  const todayUtc = new Date(
    Date.UTC(today.year, today.month - 1, today.day),
  )

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(todayUtc)
    date.setUTCDate(todayUtc.getUTCDate() - (6 - index))

    return getDateKey(date)
  })
}

function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

function formatDateTime(date: Date | null) {
  if (!date) return 'Aucune activité'

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Africa/Tunis',
  }).format(date)
}

function formatDuration(duration: number | null) {
  if (duration === null) return '—'

  const totalSeconds = Math.round(duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes} min ${String(seconds).padStart(2, '0')} s`
}

function formatAverageAnswers(value: number | null) {
  if (value === null) return '—'

  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
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

  const sessionStartTimes = new Map<string, number>()
  const sessionCompleteTimes = new Map<string, number>()

  const answerCounts = new Map<string, CountItem>()
  const recommendationCounts = new Map<string, CountItem>()
  const pathCounts = new Map<string, CountItem>()

  const sessionAnswers = new Map<
    string,
    Array<{ sequence: number; label: string }>
  >()

  const dailyStartedSessions = new Map<string, Set<string>>()

  let totalAnswers = 0
  let latestActivity: Date | null = null

  for (const event of events) {
    const eventDate = new Date(event.createdAt)

    if (!latestActivity || eventDate > latestActivity) {
      latestActivity = eventDate
    }

    if (event.eventType === 'start') {
      startedSessions.add(event.sessionId)

      sessionStartTimes.set(
        event.sessionId,
        eventDate.getTime(),
      )

      const dateKey = getDateKey(eventDate)
      const sessions = dailyStartedSessions.get(dateKey) ?? new Set<string>()

      sessions.add(event.sessionId)
      dailyStartedSessions.set(dateKey, sessions)
    }

    if (event.eventType === 'complete') {
      completedSessions.add(event.sessionId)

      sessionCompleteTimes.set(
        event.sessionId,
        eventDate.getTime(),
      )
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

  const completionDurations = Array.from(completedSessions)
    .map((sessionId) => {
      const startTime = sessionStartTimes.get(sessionId)
      const completeTime = sessionCompleteTimes.get(sessionId)

      if (startTime === undefined || completeTime === undefined) {
        return null
      }

      const duration = completeTime - startTime

      return duration >= 0 ? duration : null
    })
    .filter((duration): duration is number => duration !== null)

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

  const averageCompletionTime =
    completionDurations.length > 0
      ? completionDurations.reduce((sum, duration) => sum + duration, 0) /
        completionDurations.length
      : null

  const averageAnswersPerSession =
    sessionsStarted > 0 ? totalAnswers / sessionsStarted : null

  const topAnswers = Array.from(answerCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topRecommendations = Array.from(recommendationCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topPaths = Array.from(pathCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const lastSevenDays = getLastSevenDateKeys()

  const dailySessions = lastSevenDays.map((dateKey) => ({
    dateKey,
    label: formatDateLabel(dateKey),
    count: dailyStartedSessions.get(dateKey)?.size ?? 0,
  }))

  const maxDailySessions = Math.max(
    ...dailySessions.map((item) => item.count),
    1,
  )

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

        <div style={{ textAlign: 'right' }}>
          <strong>{events.length} événements</strong>

          <div
            style={{
              marginTop: '0.35rem',
              color: 'var(--theme-elevation-500)',
              fontSize: '0.85rem',
            }}
          >
            Dernière activité : {formatDateTime(latestActivity)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1.25rem 1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Sessions démarrées
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {sessionsStarted}
          </strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Sessions terminées
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {sessionsCompleted}
          </strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Taux de complétion
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {completionRate}%
          </strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Taux d&apos;abandon
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {abandonmentRate}%
          </strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Temps moyen de complétion
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {formatDuration(averageCompletionTime)}
          </strong>
        </div>

        <div>
          <div style={{ color: 'var(--theme-elevation-500)' }}>
            Réponses moyennes / session
          </div>

          <strong style={{ fontSize: '2rem' }}>
            {formatAverageAnswers(averageAnswersPerSession)}
          </strong>
        </div>
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h4>Évolution des sessions</h4>

        <p
          style={{
            marginTop: 0,
            color: 'var(--theme-elevation-500)',
          }}
        >
          Sessions démarrées au cours des 7 derniers jours
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '0.75rem',
            alignItems: 'end',
            minHeight: '180px',
          }}
        >
          {dailySessions.map((item) => {
            const height =
              item.count > 0
                ? Math.max((item.count / maxDailySessions) * 120, 12)
                : 4

            return (
              <div
                key={item.dateKey}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  height: '160px',
                }}
              >
                <strong>{item.count}</strong>

                <div
                  title={`${item.count} session(s)`}
                  style={{
                    width: '100%',
                    maxWidth: '70px',
                    height: `${height}px`,
                    borderRadius: '4px 4px 0 0',
                    background: 'var(--theme-elevation-400)',
                  }}
                />

                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--theme-elevation-500)',
                  }}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </section>

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