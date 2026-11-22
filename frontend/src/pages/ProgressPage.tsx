import React, { useEffect, useState } from 'react'
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Sigma,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { historyApi, progressApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { CalculationHistoryItem, ProgressData } from '../types'

export const ProgressPage: React.FC = () => {
  const { user } = useAuthStore()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [history, setHistory] = useState<CalculationHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [prog, hist] = await Promise.all([
        progressApi.get().catch(() => null),
        historyApi.list(0, 50).catch(() => []),
      ])
      setProgress(prog)
      setHistory(hist)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load progress records')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await historyApi.delete(id)
      setHistory(history.filter((h) => h.id !== id))
    } catch {
      // Ignored
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Student Analytics & Persistent Records</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Learning Progress & History</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track subject proficiency across syllabus units and inspect all archived mathematical calculations.
        </p>
      </div>

      {loading && <LoadingSpinner message="Retrieving learning records..." />}
      {error && <ErrorMessage message={error} />}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
              <Sigma className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{progress?.calculations_done || 0}</div>
              <div className="text-xs text-slate-400">Completed Operations</div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Calculus, matrix, differential, and numerical evaluations.</p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{progress?.quizzes_completed || 0}</div>
              <div className="text-xs text-slate-400">Quizzes Solved</div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Mastery assessments across engineering mathematics.</p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">{progress?.streak_days || 1} Days</div>
              <div className="text-xs text-slate-400">Active Study Streak</div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Consecutive days of problem solving on Educal.</p>
        </div>
      </div>

      {/* Topic Proficiency Bars */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-6">Topic Mastery Breakdown</h3>
        <div className="space-y-4">
          {[
            { topic: 'Calculus & Series', score: progress?.topic_scores?.['Calculus'] || 85 },
            { topic: 'Matrices & Linear Algebra', score: progress?.topic_scores?.['Matrices'] || 90 },
            { topic: 'Differential Equations', score: progress?.topic_scores?.['ODEs'] || 75 },
            { topic: 'Numerical Methods', score: progress?.topic_scores?.['Numerical'] || 80 },
            { topic: 'Probability & Statistics', score: progress?.topic_scores?.['Statistics'] || 95 },
          ].map((item) => (
            <div key={item.topic} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{item.topic}</span>
                <span className="text-indigo-400 font-mono">{item.score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Calculation History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Persistent Calculation History</h3>
            <p className="text-xs text-slate-400 mt-0.5">Isolated private calculations saved to your database account</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{history.length} Logged Entries</span>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No history entries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Module</th>
                  <th className="pb-3">Operation</th>
                  <th className="pb-3">Mathematical Input</th>
                  <th className="pb-3">Result</th>
                  <th className="pb-3">Recorded At</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-semibold text-slate-200 capitalize">{item.topic}</td>
                    <td className="py-3 text-indigo-400 font-mono">{item.operation}</td>
                    <td className="py-3 font-mono text-slate-300 max-w-xs truncate">
                      {item.input_data.expression || JSON.stringify(item.input_data)}
                    </td>
                    <td className="py-3 font-mono text-emerald-400 max-w-xs truncate">
                      {item.result_data.result !== undefined ? String(item.result_data.result) : 'Done'}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
