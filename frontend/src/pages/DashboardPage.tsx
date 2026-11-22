import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  Grid,
  LineChart,
  Sigma,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { historyApi, progressApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import type { CalculationHistoryItem, ProgressData } from '../types'

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [recentHistory, setRecentHistory] = useState<CalculationHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progData, histData] = await Promise.all([
          progressApi.get().catch(() => null),
          historyApi.list(0, 8).catch(() => []),
        ])
        setProgress(progData)
        setRecentHistory(histData)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const quickCalculators = [
    { title: 'Calculus Derivative', path: '/calculus', icon: Sigma, color: 'text-indigo-400 bg-indigo-500/10' },
    { title: 'Matrix Eigenvalues', path: '/matrices', icon: Grid, color: 'text-violet-400 bg-violet-500/10' },
    { title: 'Differential Equations', path: '/differential-equations', icon: Cpu, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Bisection Method', path: '/numerical-methods', icon: Activity, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Descriptive Stats', path: '/statistics', icon: BarChart3, color: 'text-pink-400 bg-pink-500/10' },
    { title: 'Function Plotter', path: '/graph-plotter', icon: LineChart, color: 'text-cyan-400 bg-cyan-500/10' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.full_name || 'Engineering Scholar'}!
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your computational derivations, active streaks, and quiz proficiencies.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{progress?.streak_days || 1} Days</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Calculations Run</span>
            <Calculator className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{progress?.calculations_done || 0}</div>
          <div className="mt-2 text-xs text-indigo-300">Logged to database</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Quizzes Solved</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{progress?.quizzes_completed || 0}</div>
          <div className="mt-2 text-xs text-emerald-400">Evaluated with explanations</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Modules Explored</span>
            <Sigma className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">6 / 6</div>
          <div className="mt-2 text-xs text-violet-300">Core syllabus coverage</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {progress?.topic_scores && Object.keys(progress.topic_scores).length > 0
              ? `${Math.round(
                  (Object.values(progress.topic_scores) as number[]).reduce((a: number, b: number) => a + b, 0) /
                    Object.values(progress.topic_scores).length
                )}%`
              : '85%'}
          </div>
          <div className="mt-2 text-xs text-pink-300">Cumulative performance</div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Launch Computation Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCalculators.map((c) => {
            const Icon = c.icon
            return (
              <Link
                key={c.title}
                to={c.path}
                className="group p-4 bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition text-center flex flex-col items-center justify-center space-y-2.5"
              >
                <div className={`p-3 rounded-xl ${c.color} group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition">
                  {c.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Recent Calculations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Persistent database log of past symbolic & numerical inputs</p>
          </div>
          <Link to="/progress" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No calculations logged yet. Try evaluating a derivative or matrix operation!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Operation</th>
                  <th className="pb-3">Input</th>
                  <th className="pb-3">Result Preview</th>
                  <th className="pb-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {recentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-semibold text-indigo-400 capitalize">{item.operation}</td>
                    <td className="py-3 font-mono text-slate-300 max-w-xs truncate">
                      {item.input_data.expression || JSON.stringify(item.input_data)}
                    </td>
                    <td className="py-3 font-mono text-emerald-400 max-w-xs truncate">
                      {item.result_data.result !== undefined ? String(item.result_data.result) : 'Solved'}
                    </td>
                    <td className="py-3 text-right text-slate-500">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
