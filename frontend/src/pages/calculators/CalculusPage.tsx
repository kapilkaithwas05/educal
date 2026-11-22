import React, { useState } from 'react'
import { ArrowRight, Calculator, HelpCircle, Sigma } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { MathDisplay } from '../../components/common/MathDisplay'
import { ResultCard } from '../../components/common/ResultCard'
import { calculusApi } from '../../services/api'
import type { CalculusResult } from '../../types'

export const CalculusPage: React.FC = () => {
  const [tab, setTab] = useState<'derivative' | 'integral' | 'limit' | 'taylor'>('derivative')
  const [expression, setExpression] = useState('x**3 - 3*x**2 + 5*x - 2')
  const [variable, setVariable] = useState('x')
  const [order, setOrder] = useState(1)
  const [lowerBound, setLowerBound] = useState('')
  const [upperBound, setUpperBound] = useState('')
  const [limitPoint, setLimitPoint] = useState('0')
  const [taylorPoint, setTaylorPoint] = useState('0')
  const [taylorOrder, setTaylorOrder] = useState(6)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CalculusResult | null>(null)

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (tab === 'derivative') {
        const res = await calculusApi.derivative({ expression, variable, order })
        setResult(res)
      } else if (tab === 'integral') {
        const lower = lowerBound ? parseFloat(lowerBound) : undefined
        const upper = upperBound ? parseFloat(upperBound) : undefined
        const res = await calculusApi.integral({
          expression,
          variable,
          lower_bound: lower,
          upper_bound: upper,
        })
        setResult(res)
      } else if (tab === 'limit') {
        const pt = limitPoint ? parseFloat(limitPoint) : 0
        const res = await calculusApi.limit({ expression, variable, point: pt })
        setResult(res)
      } else if (tab === 'taylor') {
        const pt = taylorPoint ? parseFloat(taylorPoint) : 0
        const res = await calculusApi.taylor({
          expression,
          variable,
          point: pt,
          order: taylorOrder,
        })
        setResult(res)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Computation failed.')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    { label: 'Polynomial', expr: 'x**3 - 3*x**2 + 5*x - 2' },
    { label: 'Trigonometric', expr: 'sin(x) * cos(x)' },
    { label: 'Exponential & Log', expr: 'exp(-x**2) + log(x)' },
    { label: 'Rational Function', expr: '(x**2 - 1) / (x + 1)' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3">
          <Sigma className="w-3.5 h-3.5" />
          <span>Symbolic Calculus Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Calculus & Series Expansion</h1>
        <p className="mt-1 text-sm text-slate-400">
          Compute analytical derivatives, definite/indefinite integrals, limits, and Taylor polynomials with step-by-step derivation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'derivative', label: 'Differentiation' },
          { id: 'integral', label: 'Integration' },
          { id: 'limit', label: 'Limits' },
          { id: 'taylor', label: 'Taylor Series' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id as any)
              setResult(null)
            }}
            className={`flex-1 min-w-[120px] py-2.5 text-xs font-semibold rounded-xl transition ${
              tab === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Calculator Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleCompute} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mathematical Expression f({variable})
              </label>
              <span className="text-xs text-slate-500 font-mono">Use standard notation (e.g. x^2 or x**2, sin(x))</span>
            </div>
            <input
              type="text"
              required
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white font-mono text-base focus:outline-none transition shadow-inner"
              placeholder="e.g. x**3 - 3*x + 1"
            />

            {/* Examples */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-slate-500">Preset Examples:</span>
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => setExpression(ex.expr)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-[11px] transition"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Independent Variable</label>
              <select
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="x">x</option>
                <option value="t">t</option>
                <option value="y">y</option>
                <option value="z">z</option>
                <option value="theta">θ (theta)</option>
              </select>
            </div>

            {tab === 'derivative' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Derivative Order (n)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {tab === 'integral' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Lower Bound a (Optional)</label>
                  <input
                    type="text"
                    value={lowerBound}
                    onChange={(e) => setLowerBound(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. 0 or blank for indefinite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Upper Bound b (Optional)</label>
                  <input
                    type="text"
                    value={upperBound}
                    onChange={(e) => setUpperBound(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. 1"
                  />
                </div>
              </>
            )}

            {tab === 'limit' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Approaching Point ({variable} →)</label>
                <input
                  type="text"
                  value={limitPoint}
                  onChange={(e) => setLimitPoint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="e.g. 0 or 1"
                />
              </div>
            )}

            {tab === 'taylor' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Expansion Point (x₀)</label>
                  <input
                    type="text"
                    value={taylorPoint}
                    onChange={(e) => setTaylorPoint(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. 0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Expansion Order</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={taylorOrder}
                    onChange={(e) => setTaylorOrder(parseInt(e.target.value) || 6)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? 'Evaluating...' : 'Solve with Step-by-Step Derivation'}</span>
          </button>
        </form>
      </div>

      {/* Output Section */}
      {loading && <LoadingSpinner message="Deriving symbolic solution and generating steps..." />}
      {error && <ErrorMessage message={error} />}
      {result && (
        <ResultCard
          title={
            tab === 'derivative'
              ? `Derivative of Order ${order}`
              : tab === 'integral'
              ? lowerBound && upperBound
                ? `Definite Integral [${lowerBound}, ${upperBound}]`
                : 'Indefinite Integral'
              : tab === 'limit'
              ? `Limit as ${variable} → ${limitPoint}`
              : `Taylor Series Expansion (Order ${taylorOrder})`
          }
          result={result.result}
          latex={result.latex}
          numeric={result.numeric}
          steps={result.steps}
        />
      )}
    </div>
  )
}
