import React, { useState } from 'react'
import { Calculator, Grid } from 'lucide-react'
import { ErrorMessage } from '../../components/common/ErrorMessage'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { MathDisplay } from '../../components/common/MathDisplay'
import { ResultCard } from '../../components/common/ResultCard'
import { matrixApi } from '../../services/api'
import type { MatrixResult } from '../../types'

export const MatrixPage: React.FC = () => {
  const [tab, setTab] = useState<'determinant' | 'inverse' | 'eigenvalues' | 'rank' | 'multiply' | 'solve'>('determinant')
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(2)

  const [matrixA, setMatrixA] = useState<number[][]>([
    [4, 2],
    [3, 5],
  ])

  const [matrixB, setMatrixB] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ])

  const [vectorB, setVectorB] = useState<number[]>([14, 26])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MatrixResult | null>(null)

  const handleResize = (newRows: number, newCols: number) => {
    setRows(newRows)
    setCols(newCols)
    const newA: number[][] = []
    for (let r = 0; r < newRows; r++) {
      const row: number[] = []
      for (let c = 0; c < newCols; c++) {
        row.push(matrixA[r]?.[c] ?? (r === c ? 1 : 0))
      }
      newA.push(row)
    }
    setMatrixA(newA)

    const newVec: number[] = []
    for (let r = 0; r < newRows; r++) {
      newVec.push(vectorB[r] ?? 1)
    }
    setVectorB(newVec)
  }

  const updateCellA = (r: number, c: number, val: number) => {
    const updated = matrixA.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    )
    setMatrixA(updated)
  }

  const updateCellB = (r: number, c: number, val: number) => {
    const updated = matrixB.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    )
    setMatrixB(updated)
  }

  const updateVecB = (idx: number, val: number) => {
    const updated = [...vectorB]
    updated[idx] = val
    setVectorB(updated)
  }

  const handleCompute = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (tab === 'determinant') {
        const res = await matrixApi.determinant(matrixA)
        setResult(res)
      } else if (tab === 'inverse') {
        const res = await matrixApi.inverse(matrixA)
        setResult(res)
      } else if (tab === 'eigenvalues') {
        const res = await matrixApi.eigenvalues(matrixA)
        setResult(res)
      } else if (tab === 'rank') {
        const res = await matrixApi.rank(matrixA)
        setResult(res)
      } else if (tab === 'multiply') {
        const res = await matrixApi.multiply(matrixA, matrixB)
        setResult(res)
      } else if (tab === 'solve') {
        const res = await matrixApi.solve(matrixA, vectorB)
        setResult(res)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Matrix calculation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3">
          <Grid className="w-3.5 h-3.5" />
          <span>Linear Algebra Computation Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Matrix Calculator & Solver</h1>
        <p className="mt-1 text-sm text-slate-400">
          Compute determinants, matrix inverses, eigenvalues, rank, matrix multiplication, and linear systems Ax = b.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'determinant', label: 'Determinant' },
          { id: 'inverse', label: 'Inverse (A⁻¹)' },
          { id: 'eigenvalues', label: 'Eigenvalues' },
          { id: 'rank', label: 'Rank' },
          { id: 'multiply', label: 'Multiplication' },
          { id: 'solve', label: 'Solve Ax = b' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id as any)
              setResult(null)
            }}
            className={`flex-1 min-w-[110px] py-2.5 text-xs font-semibold rounded-xl transition ${
              tab === t.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dimension picker */}
      <div className="flex items-center space-x-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
        <span className="font-semibold">Matrix Dimension:</span>
        {[2, 3, 4].map((dim) => (
          <button
            key={dim}
            onClick={() => handleResize(dim, dim)}
            className={`px-3 py-1.5 rounded-lg font-mono transition ${
              rows === dim && cols === dim
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {dim} × {dim}
          </button>
        ))}
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matrix A */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Matrix A ({rows} × {cols})</h3>
          <div
            className="grid gap-2 max-w-xs mx-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {matrixA.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`${r}-${c}`}
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => updateCellA(r, c, parseFloat(e.target.value) || 0)}
                  className="w-full text-center py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-white font-mono text-sm focus:outline-none transition"
                />
              ))
            )}
          </div>
        </div>

        {/* Matrix B or Vector b */}
        {tab === 'multiply' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Matrix B ({rows} × {cols})</h3>
            <div
              className="grid gap-2 max-w-xs mx-auto"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {matrixB.slice(0, rows).map((row, r) =>
                row.slice(0, cols).map((val, c) => (
                  <input
                    key={`b-${r}-${c}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => updateCellB(r, c, parseFloat(e.target.value) || 0)}
                    className="w-full text-center py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-white font-mono text-sm focus:outline-none transition"
                  />
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'solve' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Vector b ({rows} × 1)</h3>
            <div className="grid gap-2 max-w-[120px] mx-auto">
              {vectorB.slice(0, rows).map((val, idx) => (
                <input
                  key={`v-${idx}`}
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => updateVecB(idx, parseFloat(e.target.value) || 0)}
                  className="w-full text-center py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl text-white font-mono text-sm focus:outline-none transition"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleCompute}
        disabled={loading}
        className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xl shadow-violet-600/25 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
      >
        <Calculator className="w-4 h-4" />
        <span>{loading ? 'Executing Linear Algebra Operation...' : 'Calculate Matrix Result'}</span>
      </button>

      {/* Output */}
      {loading && <LoadingSpinner message="Evaluating matrix transformation..." />}
      {error && <ErrorMessage message={error} />}
      {result && (
        <ResultCard
          title={`Matrix ${tab.toUpperCase()} Output`}
          result={typeof result.result === 'object' ? JSON.stringify(result.result) : String(result.result)}
          latex={result.latex}
          steps={result.steps}
        />
      )}
    </div>
  )
}
