import React, { useState } from 'react'
import { Calculator, Cpu } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ResultCard } from '../../components/common/ResultCard'
import { odeApi } from '../../services/api'
import type { ODEResult } from '../../types'

export const DifferentialEquationsPage: React.FC = () => {
  const [equation, setEquation] = useState("y'' + 4*y = 0")
  const [variable, setVariable] = useState('x')
  const [funcName, setFuncName] = useState('y')
  const [y0, setY0] = useState('1')
  const [dy0, setDy0] = useState('2')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ODEResult | null>(null)

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const ics: Record<string, number> = {}
      if (y0 !== '') ics['y(0)'] = parseFloat(y0)
      if (dy0 !== '') ics["y'(0)"] = parseFloat(dy0)

      const res = await odeApi.solve({
        equation,
        variable,
        function: funcName,
        initial_conditions: Object.keys(ics).length > 0 ? ics : undefined,
      })
      setResult(res)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'ODE solver failed to find analytical solution.')
    } finally {
      setLoading(false)
    }
  }

  const presetODEs = [
    { label: 'Harmonic Oscillator', eq: "y'' + 4*y = 0", y0: '1', dy0: '2' },
    { label: 'First-Order Decay', eq: "y' + 3*y = 0", y0: '5', dy0: '' },
    { label: 'Inhomogeneous Linear', eq: "y' + y = x", y0: '0', dy0: '' },
    { label: 'Damped Vibration', eq: "y'' + 2*y' + 5*y = 0", y0: '1', dy0: '0' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Ordinary Differential Equations Solver</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Differential Equations Solver</h1>
        <p className="mt-1 text-sm text-slate-400">
          Solve 1st & 2nd order linear and non-linear ODEs, initial value problems, and discover general and particular solutions.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleSolve} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Differential Equation Expression
            </label>
            <input
              type="text"
              required
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl text-white font-mono text-base focus:outline-none transition shadow-inner"
              placeholder="e.g. y'' + 4*y = 0 or y' + 2*y = exp(x)"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-slate-500">Preset Systems:</span>
              {presetODEs.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setEquation(p.eq)
                    setY0(p.y0)
                    setDy0(p.dy0)
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono text-[11px] transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Independent Variable</label>
              <input
                type="text"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dependent Function</label>
              <input
                type="text"
                value={funcName}
                onChange={(e) => setFuncName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">y(0) Initial Condition</label>
              <input
                type="text"
                value={y0}
                onChange={(e) => setY0(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-mono"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">y'(0) Initial Condition</label>
              <input
                type="text"
                value={dy0}
                onChange={(e) => setDy0(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-mono"
                placeholder="Optional"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-amber-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? 'Solving Differential Equation...' : 'Solve ODE'}</span>
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Solving ordinary differential equation via SymPy dsolve..." />}
      {error && <ErrorMessage message={error} />}
      {result && (
        <ResultCard
          title="Differential Equation Analytical Solution"
          result={result.result}
          latex={result.latex}
          steps={
            result.particular_solution
              ? [
                  `General Solution: ${result.general_solution}`,
                  `Applied initial conditions y(0)=${y0 || '0'}, y'(0)=${dy0 || '0'}`,
                  `Particular Solution: ${result.particular_solution}`,
                ]
              : [`General Solution: ${result.general_solution}`]
          }
        />
      )}
    </div>
  )
}
