'use client'

import type { Question, Result as ResultType } from '@/payload-types'
import { useState } from 'react'

import { Result } from './Result'

type QuestionnaireClientProps = {
  firstQuestion: Question
}

export function QuestionnaireClient({
  firstQuestion,
}: QuestionnaireClientProps) {
  const [currentQuestion, setCurrentQuestion] =
    useState<Question>(firstQuestion)

  const [currentResult, setCurrentResult] =
    useState<ResultType | null>(null)

  const handleAnswer = (
    answer: NonNullable<Question['answers']>[number],
  ) => {
    if (answer.result && typeof answer.result === 'object') {
      setCurrentResult(answer.result)
      return
    }

    if (
      answer.nextQuestion &&
      typeof answer.nextQuestion === 'object'
    ) {
      setCurrentQuestion(answer.nextQuestion)
    }
  }

  if (currentResult) {
    return <Result result={currentResult} />
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
    </main>
  )
}