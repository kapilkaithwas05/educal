import React, { useEffect, useState } from 'react'
import { Award, BookOpen, CheckCircle, ChevronRight, HelpCircle, RotateCcw, XCircle } from 'lucide-react'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { quizApi } from '../services/api'
import type { Quiz, QuizResult } from '../types'

export const QuizPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await quizApi.list()
      setQuizzes(data)
      if (data.length > 0 && !activeQuiz) {
        setActiveQuiz(data[0])
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (quizResult) return // Locked after submit
    setSelectedAnswers({ ...selectedAnswers, [qId]: optIdx })
  }

  const handleSubmit = async () => {
    if (!activeQuiz) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await quizApi.submit({
        quiz_id: activeQuiz.id,
        answers: selectedAnswers,
      })
      setQuizResult(res)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Submission error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setQuizResult(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Student Quiz & Assessment</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Engineering Mathematics Quizzes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Reinforce conceptual understanding with problem sets, instant grading, and automated derivations.
        </p>
      </div>

      {loading && <LoadingSpinner message="Loading quiz modules..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && quizzes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quiz Selector sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Available Quizzes</h3>
            {quizzes.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuiz(q)
                  setSelectedAnswers({})
                  setQuizResult(null)
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition text-xs flex items-center justify-between ${
                  activeQuiz?.id === q.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">{q.title}</div>
                  <div className={`text-[10px] uppercase font-bold mt-0.5 ${activeQuiz?.id === q.id ? 'text-indigo-200' : 'text-indigo-400'}`}>
                    {q.topic} • {q.difficulty}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>
            ))}
          </div>

          {/* Active Quiz Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeQuiz && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeQuiz.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{activeQuiz.description}</p>
                  </div>
                  {quizResult && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold text-sm">
                      <Award className="w-4 h-4" />
                      <span>
                        Score: {quizResult.score} / {quizResult.total_points} ({quizResult.percentage}%)
                      </span>
                    </div>
                  )}
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {activeQuiz.questions.map((q, idx) => {
                    const selected = selectedAnswers[q.id]
                    return (
                      <div key={q.id} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div className="text-sm font-semibold text-white pt-0.5">{q.text}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-indigo-500/50'

                            if (selected === optIdx) {
                              btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            }

                            if (quizResult) {
                              // Answer revealed
                              const isCorrect = (q as any).correct_index !== undefined
                                ? (q as any).correct_index === optIdx
                                : false
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              } else if (selected === optIdx) {
                                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300'
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                className={`text-left p-3 rounded-xl border text-xs font-mono transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizResult && selected === optIdx && (
                                  <span>
                                    {selected === (q as any).correct_index ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-rose-400" />
                                    )}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {quizResult && quizResult.explanations[q.id] && (
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 mt-2">
                            <span className="font-semibold text-indigo-400">Explanation: </span>
                            {quizResult.explanations[q.id]}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Quiz</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !!quizResult}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-105"
                  >
                    {submitting ? 'Grading Answers...' : quizResult ? 'Graded' : 'Submit Answers for Grading'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
