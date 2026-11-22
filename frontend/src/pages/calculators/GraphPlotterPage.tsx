import React, { useState } from 'react'
import { LineChart, Play, Plus, Trash2, ZoomIn } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { graphApi } from '../../services/api'
import type { GraphResult } from '../../types'

export const GraphPlotterPage: React.FC = () => {
  const [expressions, setExpressions] = useState<string[]>([
    'sin(x)',
    'cos(x)',
    'x**2 / 10',
  ])
  const [variable, setVariable] = useState('x')
  const [xMin, setXMin] = useState('-10')
  const [xMax, setXMax] = useState('10')
  const [points, setPoints] = useState('400')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<GraphResult | null>(null)

  const handleAddFunc = () => {
    if (expressions.length < 6) {
      setExpressions([...expressions, 'x'])
    }
  }

  const handleRemoveFunc = (index: number) => {
    setExpressions(expressions.filter((_, i) => i !== index))
  }

  const handleUpdateFunc = (index: number, val: string) => {
    const updated = [...expressions]
    updated[index] = val
    setExpressions(updated)
  }

  const handlePlot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await graphApi.plot({
        expressions,
        variable,
        x_min: parseFloat(xMin),
        x_max: parseFloat(xMax),
        points: parseInt(points) || 400,
      })
      setGraphData(res)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Plotting failed.')
    } finally {
      setLoading(false)
    }
  }

  // Generate SVG path for a trace
  const renderSVGPlot = (data: GraphResult) => {
    const width = 800
    const height = 450
    const padding = 50

    const minX = parseFloat(xMin)
    const maxX = parseFloat(xMax)

    // Compute y limits
    let minY = -5
    let maxY = 5
    data.traces.forEach((t) => {
      t.y.forEach((val) => {
        if (val !== null && !isNaN(val)) {
          if (val < minY) minY = Math.max(val, -50)
          if (val > maxY) maxY = Math.min(val, 50)
        }
      })
    })

    const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (width - 2 * padding)
    const scaleY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - 2 * padding)

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-950 rounded-2xl border border-slate-800">
        {/* Grid lines */}
        <line x1={padding} y1={scaleY(0)} x2={width - padding} y2={scaleY(0)} stroke="#475569" strokeWidth="1.5" />
        <line x1={scaleX(0)} y1={padding} x2={scaleX(0)} y2={height - padding} stroke="#475569" strokeWidth="1.5" />

        {/* Traces */}
        {data.traces.map((trace, tIdx) => {
          let pathD = ''
          let isMoving = true

          trace.x.forEach((xVal, idx) => {
            const yVal = trace.y[idx]
            if (yVal === null || isNaN(yVal) || yVal < minY || yVal > maxY) {
              isMoving = true
            } else {
              const sx = scaleX(xVal)
              const sy = scaleY(yVal)
              if (isMoving) {
                pathD += `M ${sx} ${sy} `
                isMoving = false
              } else {
                pathD += `L ${sx} ${sy} `
              }
            }
          })

          return (
            <path
              key={tIdx}
              d={pathD}
              fill="none"
              stroke={colors[tIdx % colors.length]}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )
        })}

        {/* Axis labels */}
        <text x={width - padding + 5} y={scaleY(0) + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace">x</text>
        <text x={scaleX(0) + 6} y={padding - 5} fill="#94a3b8" fontSize="11" fontFamily="monospace">y</text>
      </svg>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3">
          <LineChart className="w-3.5 h-3.5" />
          <span>Multi-Function 2D Coordinate Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Interactive Function Plotter</h1>
        <p className="mt-1 text-sm text-slate-400">
          Plot up to six simultaneous mathematical functions, compare derivatives with roots, and adjust bounds.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
        <form onSubmit={handlePlot} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Function Curves (y = f({variable}))
              </label>
              <button
                type="button"
                onClick={handleAddFunc}
                className="flex items-center space-x-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Curve</span>
              </button>
            </div>

            {expressions.map((expr, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-6 text-xs text-slate-500 font-mono">f{idx + 1}:</span>
                <input
                  type="text"
                  required
                  value={expr}
                  onChange={(e) => handleUpdateFunc(idx, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-white font-mono text-sm focus:outline-none transition"
                  placeholder="e.g. sin(x)"
                />
                {expressions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFunc(idx)}
                    className="p-2.5 bg-slate-950 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">x_min</label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">x_max</label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Sampling Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Variable</label>
              <input
                type="text"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-cyan-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{loading ? 'Sampling & Generating Plot...' : 'Render Interactive Plot'}</span>
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Calculating coordinate mesh & bounds..." />}
      {error && <ErrorMessage message={error} />}

      {graphData && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {graphData.traces.map((t, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'][idx % 6] }}
                />
                <span className="text-slate-200">{t.name}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">{renderSVGPlot(graphData)}</div>
        </div>
      )}
    </div>
  )
}
