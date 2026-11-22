import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Copy, Sparkles } from 'lucide-react'
import { MathDisplay } from './MathDisplay'

interface ResultCardProps {
  title: string
  result: string
  latex?: string
  numeric?: number
  steps?: string[]
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  result,
  latex,
  numeric,
  steps,
}) => {
  const [copied, setCopied] = useState(false)
  const [showSteps, setShowSteps] = useState(true)

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl shadow-indigo-950/20 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="my-5 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
        {latex ? (
          <MathDisplay latex={latex} displayMode={true} className="text-xl sm:text-2xl text-indigo-300 font-math" />
        ) : (
          <code className="text-lg text-indigo-300 font-mono">{result}</code>
        )}

        {numeric !== undefined && numeric !== null && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-sm text-slate-400">
            Decimal Approximation: <span className="font-mono text-emerald-400 font-semibold">{numeric}</span>
          </div>
        )}
      </div>

      {steps && steps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center justify-between w-full text-sm font-medium text-slate-300 hover:text-indigo-400 transition"
          >
            <span>Step-by-Step Mathematical Derivation ({steps.length})</span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSteps && (
            <ol className="mt-3 space-y-2.5 text-sm text-slate-300">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 overflow-x-auto pt-0.5">
                    {step.includes('\\') ? <MathDisplay latex={step} /> : step}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}
