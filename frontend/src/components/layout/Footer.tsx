import React from 'react'
import { Calculator, Github, Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">Educal</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Advanced Engineering Mathematics & Computational Analysis platform. Learn algorithms, practice problem sets, and visualize step-by-step solutions.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Core Modules</h4>
            <ul className="space-y-2">
              <li><Link to="/calculus" className="hover:text-indigo-400 transition">Calculus & Series</Link></li>
              <li><Link to="/matrices" className="hover:text-indigo-400 transition">Matrix & Linear Algebra</Link></li>
              <li><Link to="/differential-equations" className="hover:text-indigo-400 transition">Differential Equations</Link></li>
              <li><Link to="/numerical-methods" className="hover:text-indigo-400 transition">Numerical Methods</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Analysis & Practice</h4>
            <ul className="space-y-2">
              <li><Link to="/statistics" className="hover:text-indigo-400 transition">Probability & Statistics</Link></li>
              <li><Link to="/graph-plotter" className="hover:text-indigo-400 transition">Interactive Function Plotter</Link></li>
              <li><Link to="/quizzes" className="hover:text-indigo-400 transition">Topic Practice & Quizzes</Link></li>
              <li><Link to="/progress" className="hover:text-indigo-400 transition">Student Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Engine & Reliability</h4>
            <p className="text-slate-500 mb-2">Powered by SymPy symbolic mathematics and NumPy/SciPy numerical algorithms.</p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Computation Engine Online</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© {new Date().getFullYear()} Educal Platform. Designed for Engineering Education.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with precision for students and engineers</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
