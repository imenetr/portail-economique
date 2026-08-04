'use client'

import type { Question, Result as ResultType } from '@/payload-types'
import { useState } from 'react'

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

  if (currentResult) {
    return (
      <main>
        <Result result={currentResult} />
        <Recap items={recapItems} />

        <button type="button" onClick={handleBack}>
          Retour
        </button>

        <button type="button" onClick={handleReset}>
          Recommencer
        </button>
      </main>
    )
  }

  return (
    <main>
      <h1>{currentQuestion.title}</h1>

      <div>
        {currentQuestion.answers?.map((answer) => (
          <button
            key={answer.id}
            type="button"
            onClick={() => handleAnswer(answer)}
          >
            {answer.text}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <button type="button" onClick={handleBack}>
          Retour
        </button>
      )}

      <button type="button" onClick={handleReset}>
        Recommencer
      </button>
    </main>
  )
}