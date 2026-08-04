type RecapItem = {
  question: string
  answer: string
}

type RecapProps = {
  items: RecapItem[]
}

export function Recap({ items }: RecapProps) {
  if (items.length === 0) return null

  return (
    <section>
      <h2>Récapitulatif de vos réponses</h2>

      <ul>
        {items.map((item, index) => (
          <li key={`${item.question}-${index}`}>
            <strong>{item.question}</strong>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}