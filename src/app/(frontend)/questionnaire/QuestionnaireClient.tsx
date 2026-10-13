'use client'

import { useState } from 'react'

import type { Question, Recommendation } from '@/payload-types'

import styles from './questionnaire.module.css'
import { Recap } from './Recap'

type QuestionnaireClientProps = {
  firstQuestion: Question
}

type RecapItem = {
  question: string
  answer: string
}

export function QuestionnaireClient({
  firstQuestion,
}: QuestionnaireClientProps) {
  const [currentQuestion, setCurrentQuestion] =
    useState<Question>(firstQuestion)

  const [currentRecommendation, setCurrentRecommendation] =
    useState<Recommendation | null>(null)

  const [history, setHistory] = useState<Question[]>([])
  const [recapItems, setRecapItems] = useState<RecapItem[]>([])

  const handleAnswer = (
    answer: NonNullable<Question['answers']>[number],
  ) => {
    if (typeof answer === 'string') return

    setRecapItems((previousItems) => [
      ...previousItems,
      {
        question: currentQuestion.title,
        answer: answer.text,
      },
    ])

    if (
      answer.recommendation &&
      typeof answer.recommendation === 'object'
    ) {
      setCurrentRecommendation(answer.recommendation)
      return
    }

    if (
      answer.nextQuestion &&
      typeof answer.nextQuestion === 'object'
    ) {
      setHistory((previousHistory) => [
        ...previousHistory,
        currentQuestion,
      ])

      setCurrentQuestion(answer.nextQuestion)
    }
  }

  const handleBack = () => {
    if (currentRecommendation) {
      setCurrentRecommendation(null)
      setRecapItems((previousItems) => previousItems.slice(0, -1))
      return
    }

    const previousQuestion = history.at(-1)

    if (!previousQuestion) return

    setCurrentQuestion(previousQuestion)
    setHistory((previousHistory) => previousHistory.slice(0, -1))
    setRecapItems((previousItems) => previousItems.slice(0, -1))
  }

  const handleReset = () => {
    setCurrentQuestion(firstQuestion)
    setCurrentRecommendation(null)
    setHistory([])
    setRecapItems([])
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <div className={styles.gradientCard}>
              <div className={styles.glassPanel}>
                {currentRecommendation ? (
                  <div>
                    <h1 className={styles.question}>
                      {currentRecommendation.title}
                    </h1>

                    {currentRecommendation.description && (
                      <p>{currentRecommendation.description}</p>
                    )}

                    {currentRecommendation.website && (
                      <a
                        href={currentRecommendation.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Consulter le site
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    <h1 className={styles.question}>
                      {currentQuestion.title}
                    </h1>

                    <div className={styles.answers}>
                      {currentQuestion.answers?.map((answer) => {
                        if (typeof answer === 'string') return null

                        return (
                          <button
                            className={styles.answerButton}
                            key={answer.id}
                            type="button"
                            onClick={() => handleAnswer(answer)}
                          >
                            {answer.text}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                <div className={styles.navigation}>
                  <button
                    className={styles.backButton}
                    type="button"
                    onClick={handleBack}
                    disabled={
                      !currentRecommendation && history.length === 0
                    }
                  >
                    ← Retour
                  </button>

                  <button
                    className={styles.resetButton}
                    type="button"
                    onClick={handleReset}
                    disabled={
                      !currentRecommendation && history.length === 0
                    }
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>

          {recapItems.length > 0 && (
            <aside className={styles.recapColumn}>
              <div className={styles.gradientCard}>
                <div className={styles.glassPanel}>
                  <Recap items={recapItems} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}