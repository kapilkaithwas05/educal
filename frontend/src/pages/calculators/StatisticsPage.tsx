import React, { useState } from 'react'
import { BarChart3, Calculator, TrendingUp } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ResultCard } from '../../components/common/ResultCard'
import { statsApi } from '../../services/api'
import type { StatisticsResult } from '../../types'

export const StatisticsPage: React.FC = () => {
  const [tab, setTab] = useState<'descriptive' | 'regression'>('descriptive')
  const [rawNumbers, setRawNumbers] = useState('2, 4, 4, 4, 5, 5, 7, 9, 12, 14, 15')
  const [xData, setXData] = useState('1, 2, 3, 4, 5, 6, 7')
  const [yData, setYData] = useState('2.1, 3.9, 6.2, 8.1, 9.9, 12.3, 14.1')
  const [regType, setRegType] = useState('linear')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StatisticsResult | null>(null)

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (tab === 'descriptive') {
        const nums = rawNumbers
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((n) => parseFloat(n))
          .filter((n) => !isNaN(n))

        if (nums.length === 0) throw new Error('Please enter at least 1 valid numerical data point.')
        const res = await statsApi.descriptive(nums)
        setResult(res)
      } else {
        const xs = xData.split(/[\s,]+/).filter(Boolean).map(Number)
        const ys = yData.split(/[\s,]+/).filter(Boolean).map(Number)
        if (xs.length !== ys.length) throw new Error('x_data and y_data must contain matching numbers of elements.')
        const res = await statsApi.regression(xs, ys, regType)
        setResult(res)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Statistical calculation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-semibold mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Engineering Probability & Statistics</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Statistical Analysis & Modeling</h1>
        <p className="mt-1 text-sm text-slate-400">
          Compute sample and population parameters (mean, median, variance, standard deviation, IQR) and fit linear/polynomial regressions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            setTab('descriptive')
            setResult(null)
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition ${
            tab === 'descriptive'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Descriptive Statistics
        </button>
        <button
          onClick={() => {
            setTab('regression')
            setResult(null)
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition ${
            tab === 'regression'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Regression Modeling
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handleCompute} className="space-y-6">
          {tab === 'descriptive' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Sample Dataset (comma or whitespace separated)
              </label>
              <textarea
                rows={3}
                required
                value={rawNumbers}
                onChange={(e) => setRawNumbers(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl text-white font-mono text-sm focus:outline-none transition shadow-inner"
                placeholder="2, 4, 4, 4, 5, 5, 7, 9, 12"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Independent Variable X Data
                </label>
                <input
                  type="text"
                  required
                  value={xData}
                  onChange={(e) => setXData(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl text-white font-mono text-sm focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Dependent Variable Y Data
                </label>
                <input
                  type="text"
                  required
                  value={yData}
                  onChange={(e) => setYData(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-2xl text-white font-mono text-sm focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Regression Model</label>
                <select
                  value={regType}
                  onChange={(e) => setRegType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="linear">Linear Regression (y = mx + b)</option>
                  <option value="polynomial">Polynomial Regression (Degree 2)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-pink-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{loading ? 'Evaluating Data...' : 'Run Statistical Analysis'}</span>
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Calculating statistical estimators..." />}
      {error && <ErrorMessage message={error} />}

      {result && tab === 'descriptive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(result.result).map(([k, v]) => (
              <div key={k} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  {k.replace('_', ' ')}
                </div>
                <div className="text-xl font-bold text-white mt-1 font-mono">{String(v)}</div>
              </div>
            ))}
          </div>

          <ResultCard
            title="Statistical Summary"
            result={`Mean = ${result.result.mean}, Median = ${result.result.median}, Std Dev = ${result.result.std_dev}`}
            steps={[
              `1. Sample Size n = ${result.result.count}`,
              `2. Mean x̄ = (∑x)/n = ${result.result.mean}`,
              `3. Median = ${result.result.median}, Mode = ${result.result.mode}`,
              `4. Sample Variance s² = ${result.result.variance} (Bessel corrected)`,
              `5. Sample Standard Deviation s = ${result.result.std_dev}`,
              `6. Quartiles: Q1 = ${result.result.q1}, Q3 = ${result.result.q3}, IQR = ${result.result.iqr}`,
            ]}
          />
        </div>
      )}

      {result && tab === 'regression' && (
        <ResultCard
          title="Fitted Regression Model"
          result={result.result.equation || JSON.stringify(result.result)}
          steps={[
            `Equation: ${result.result.equation}`,
            `Coefficient of Determination R² = ${result.result.r_squared}`,
            result.result.slope !== undefined ? `Slope m = ${result.result.slope}` : '',
            result.result.intercept !== undefined ? `Intercept b = ${result.result.intercept}` : '',
            result.result.p_value !== undefined ? `p-value = ${result.result.p_value}` : '',
          ].filter(Boolean)}
        />
      )}
    </div>
  )
}
