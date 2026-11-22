import React, { useState } from 'react'
import { Activity, Calculator } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ResultCard } from '../../components/common/ResultCard'
import { numericalApi } from '../../services/api'
import type { NumericalResult } from '../../types'

export const NumericalMethodsPage: React.FC = () => {
  const [method, setMethod] = useState<'bisection' | 'newton' | 'rk4' | 'simpson'>('bisection')
  const [expression, setExpression] = useState('x**3 - x - 2')
  const [variable, setVariable] = useState('x')
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [guess, setGuess] = useState('1.5')
  const [tolerance, setTolerance] = useState('0.00001')
  const [stepH, setStepH] = useState('0.1')
  const [y0, setY0] = useState('1.0')
  const [nIntervals, setNIntervals] = useState('100')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<NumericalResult | null>(null)

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (method === 'bisection') {
        const res = await numericalApi.bisection({
          expression,
          variable,
          a: parseFloat(a),
          b: parseFloat(b),
          tolerance: parseFloat(tolerance),
        })
        setResult(res)
      } else if (method === 'newton') {
        const res = await numericalApi.newtonRaphson({
          expression,
          variable,
          initial_guess: parseFloat(guess),
          tolerance: parseFloat(tolerance),
        })
        setResult(res)
      } else if (method === 'rk4') {
        const res = await numericalApi.rungeKutta({
          expression,
          variable,
          a: parseFloat(a),
          b: parseFloat(b),
          h: parseFloat(stepH),
          y0: parseFloat(y0),
        })
        setResult(res)
      } else if (method === 'simpson') {
        const res = await numericalApi.integration({
          expression,
          variable,
          a: parseFloat(a),
          b: parseFloat(b),
          n: parseInt(nIntervals),
        })
        setResult(res)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Numerical algorithm did not converge.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Numerical Computation Algorithms</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Numerical Methods & Root Finding</h1>
        <p className="mt-1 text-sm text-slate-400">
          Solve non-linear roots with Bisection & Newton-Raphson, integrate with Simpson's Rule, and simulate ODE initial value problems using RK4.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'bisection', label: 'Bisection Method' },
          { id: 'newton', label: 'Newton-Raphson' },
          { id: 'simpson', label: "Simpson's 1/3 Rule" },
          { id: 'rk4', label: 'Runge-Kutta (RK4)' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMethod(m.id as any)
              setResult(null)
            }}
            className={`flex-1 min-w-[130px] py-2.5 text-xs font-semibold rounded-xl transition ${
              method === m.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleCompute} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Function f({variable}) {method === 'rk4' ? 'where dy/dx = f(x, y)' : ''}
            </label>
            <input
              type="text"
              required
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl text-white font-mono text-base focus:outline-none transition shadow-inner"
              placeholder={method === 'rk4' ? 'e.g. x + y or -2*x*y' : 'e.g. x**3 - x - 2'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {method === 'bisection' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Interval Left Bound (a)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Interval Right Bound (b)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Convergence Tolerance (ε)</label>
                  <input
                    type="text"
                    value={tolerance}
                    onChange={(e) => setTolerance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </>
            )}

            {method === 'newton' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Guess (x₀)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Convergence Tolerance (ε)</label>
                  <input
                    type="text"
                    value={tolerance}
                    onChange={(e) => setTolerance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </>
            )}

            {method === 'simpson' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Lower Bound (a)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Upper Bound (b)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Subintervals (n, even)</label>
                  <input
                    type="number"
                    min="2"
                    step="2"
                    value={nIntervals}
                    onChange={(e) => setNIntervals(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </>
            )}

            {method === 'rk4' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Point x₀</label>
                  <input
                    type="number"
                    step="any"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Point x_final</label>
                  <input
                    type="number"
                    step="any"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial y(x₀)</label>
                  <input
                    type="number"
                    step="any"
                    value={y0}
                    onChange={(e) => setY0(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-emerald-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? 'Running Numerical Algorithm...' : 'Compute Numerical Solution'}</span>
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Iterating numerical convergence..." />}
      {error && <ErrorMessage message={error} />}
      {result && (
        <div className="space-y-6">
          <ResultCard
            title={`Numerical Result (${method.toUpperCase()})`}
            result={
              typeof result.result === 'object'
                ? `Final y = ${result.result.final_y}`
                : `Root / Integral = ${result.result}`
            }
            numeric={typeof result.result === 'number' ? result.result : undefined}
            steps={
              result.steps
                ? result.steps.map(
                    (s) =>
                      `Iter ${s.iteration}: x = ${s.c_mid ?? s.x_next ?? s.x_n}, f(x) = ${s.f_c ?? s.f_xn}, Error = ${s.error}`
                  )
                : undefined
            }
          />
        </div>
      )}
    </div>
  )
}
