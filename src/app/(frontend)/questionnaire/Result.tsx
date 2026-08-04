import type { Result as ResultType } from '@/payload-types'

type ResultProps = {
  result: ResultType
}

export function Result({ result }: ResultProps) {
  return (
    <section>
      <h1>{result.title}</h1>

      {result.description && <p>{result.description}</p>}
    </section>
  )
}