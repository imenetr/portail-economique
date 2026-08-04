'use client'

import { useState } from 'react'

import type { Question, Result as ResultType } from '@/payload-types'

import styles from './questionnaire.module.css'
import { Recap } from './Recap'
import { Result } from './Result'

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

  const [currentResult, setCurrentResult] =
    useState<ResultType | null>(null)

  const [history, setHistory] = useState<Question[]>([])
  const [recapItems, setRecapItems] = useState<RecapItem[]>([])

  const handleAnswer = (
    answer: NonNullable<Question['answers']>[number],
  ) => {
    setRecapItems((previousItems) => [
      ...previousItems,
      {
        question: currentQuestion.title,
        answer: answer.text,
      },
    ])

    if (answer.result && typeof answer.result === 'object') {
      setCurrentResult(answer.result)
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
    if (currentResult) {
      setCurrentResult(null)
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
    setCurrentResult(null)
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
                {currentResult ? (
                  <Result result={currentResult} />
                ) : (
                  <>
                    <h1 className={styles.question}>
                      {currentQuestion.title}
                    </h1>

                    <div className={styles.answers}>
                      {currentQuestion.answers?.map((answer) => (
                        <button
                          className={styles.answerButton}
                          key={answer.id}
                          type="button"
                          onClick={() => handleAnswer(answer)}
                        >
                          {answer.text}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className={styles.navigation}>
                  <button
                    className={styles.backButton}
                    type="button"
                    onClick={handleBack}
                    disabled={!currentResult && history.length === 0}
                  >
                    ← Retour
                  </button>

                  <button
                    className={styles.resetButton}
                    type="button"
                    onClick={handleReset}
                    disabled={!currentResult && history.length === 0}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.recapColumn}>
            <div className={styles.gradientCard}>
              <div className={styles.glassPanel}>
                <Recap items={recapItems} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}