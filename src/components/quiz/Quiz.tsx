import { Link, useParams } from "@tanstack/react-router"
import { useState } from "react"

export function Quiz() {
  const { questionId } = useParams({ from: '/quiz/$questionId' })
  const index = parseInt(questionId.replace('quiz', ''), 10) - 1

  const questions = [
    {
      question:
        'Welche der folgenden Eigenschaften ist eine Stärke, die dabei hilft, berufliche Ziele zu erreichen?',
      answers: [
        'Kritikfähigkeit',
        'Unsicherheit',
        'Selbstüberschätzung',
        'Unzuverlässigkeit',
      ],
    },
  ]

  const question = questions[index] ?? questions[0]
  const [selected, setSelected] = useState<number | null>(null)

  const nextId = index + 1 < questions.length ? `quiz${index + 2}` : undefined

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#f4f2f3] text-center p-4 font-[ComicSansMS]">
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
          <span role="img" aria-label="avatar" className="text-4xl">
            🙂
          </span>
        </div>
      </div>

      <div className="bg-[#f0eded] p-4 rounded-md w-full max-w-sm shadow-sm mb-4">
        <p className="text-base leading-snug">{question.question}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {question.answers.map((answer, i) => {
          const isSelected = selected === i
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex justify-between items-center text-left p-3 rounded-md border transition-all shadow-sm ${
                isSelected
                  ? 'border-[#61398d] bg-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <span className="max-w-[80%]">{answer}</span>
              <span
                className={`w-5 h-5 rounded-full border-2 ${
                  isSelected
                    ? 'bg-[#61398d] border-[#61398d]'
                    : 'border-gray-300'
                }`}
              ></span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 mb-4">
        {nextId ? (
          <Link
            to={`/quiz/${nextId}`}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#f0eded] rounded-md hover:bg-gray-200 transition"
          >
            Nächste Frage <span>→</span>
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Ende des Quiz 🎉</p>
        )}
      </div>
    </div>
  )
}
