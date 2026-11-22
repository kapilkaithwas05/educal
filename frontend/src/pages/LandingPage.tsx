import React from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GraduationCap,
  Grid,
  LineChart,
  ShieldCheck,
  Sigma,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { MathDisplay } from '../components/common/MathDisplay'

export const LandingPage: React.FC = () => {
  const modules = [
    {
      title: 'Calculus & Series',
      desc: 'Symbolic derivatives, definite/indefinite integrals, limits, and Taylor/Maclaurin series expansions with complete steps.',
      icon: Sigma,
      path: '/calculus',
      formula: '\\frac{d}{dx}\\left[\\int_{a}^{x} f(t) dt\\right] = f(x)',
      color: 'from-blue-500/20 to-indigo-500/10 border-indigo-500/30 text-indigo-400',
    },
    {
      title: 'Matrices & Linear Algebra',
      desc: 'Determinants, inverses, eigenvalues/eigenvectors, matrix rank, multiplication, and solving systems of linear equations Ax = b.',
      icon: Grid,
      path: '/matrices',
      formula: '\\det(A - \\lambda I) = 0',
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400',
    },
    {
      title: 'Differential Equations',
      desc: 'First and second order ODE analytical solutions, initial value problems, integrating factors, and numerical Euler/RK4 simulation.',
      icon: Cpu,
      path: '/differential-equations',
      formula: '\\frac{dy}{dx} + P(x)y = Q(x)',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Numerical Methods',
      desc: 'Root finding via Bisection and Newton-Raphson, numerical quadrature with Simpson’s rule, and convergence analysis.',
      icon: Activity,
      path: '/numerical-methods',
      formula: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Probability & Statistics',
      desc: 'Descriptive stats (mean, median, variance, std dev, IQR), linear & polynomial regression modeling, and distribution fits.',
      icon: BarChart3,
      path: '/statistics',
      formula: 's = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}',
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    },
    {
      title: 'Interactive 2D Grapher',
      desc: 'Plot multiple simultaneous mathematical functions, examine points of intersection, adjust bounds, and zoom/pan interactively.',
      icon: LineChart,
      path: '/graph-plotter',
      formula: 'y = f(x) \\quad \\text{vs} \\quad y = g(x)',
      color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30 text-cyan-400',
    },
  ]

  const highlights = [
    { title: 'Symbolic & Exact Algebra', desc: 'Powered by SymPy to preserve fractions, radicals, and constants (π, e).' },
    { title: 'Step-by-Step Derivations', desc: 'Understand mathematical procedures, not just final numerical answers.' },
    { title: 'Safe Expression Parsing', desc: 'Strict AST parser with zero arbitrary code execution or eval vulnerability.' },
    { title: 'Continuous Progress Tracking', desc: 'Assess mastery with curated quizzes, performance streaks, and analytics.' },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Engineering Mathematics & Analysis</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Master Complex Math with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            Step-by-Step Rigor
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Educal is the computational platform built for engineering students. Solve calculus, matrices, differential equations, and numerical simulations with clear step-by-step mathematical procedures.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/calculus"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition hover:scale-105"
          >
            <span>Launch Calculators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/quizzes"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition"
          >
            Take a Practice Quiz
          </Link>
        </div>

        {/* Live Mathematical Formula Banner */}
        <div className="mt-16 max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fundamental Theorem of Engineering Mathematics</span>
            </span>
            <span className="text-emerald-400 font-mono">Live LaTeX Engine</span>
          </div>
          <div className="py-2 text-indigo-300 font-math text-lg sm:text-2xl overflow-x-auto">
            <MathDisplay
              latex="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}, \quad \nabla \cdot \mathbf{D} = \rho, \quad \int_{\Omega} \nabla \cdot \mathbf{F} \, dV = \oint_{\partial \Omega} \mathbf{F} \cdot d\mathbf{S}"
              displayMode={true}
            />
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Six Comprehensive Computation Engines
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Built from scratch for the undergraduate engineering mathematics syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.title}
                to={mod.path}
                className="group relative p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-xs text-indigo-300/80 font-math overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                    <MathDisplay latex={mod.formula} />
                  </div>
                  <span className="flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition">
                    Solve <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Highlights / Features */}
      <section className="border-t border-slate-900 bg-slate-950/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Why Educal?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight">
                Designed to Teach the Procedure, Not Just the Output
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                Most online calculators act as black boxes—giving you a floating-point number with no intuition. Educal combines symbolic derivation with numerical approximations so you can follow the mathematical theorem step-by-step.
              </p>

              <div className="mt-8 space-y-4">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-3.5">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{h.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">educal-kernel: symbolic-solver</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="text-slate-500">// Problem: Initial Value Problem (ODE)</div>
                <div className="text-indigo-400 font-semibold">y'' + 4y = 0, y(0) = 1, y'(0) = 2</div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-emerald-400">
                  <div className="text-slate-500 text-[11px] mb-1">General Solution:</div>
                  <div>y(x) = C₁·cos(2x) + C₂·sin(2x)</div>
                  <div className="text-slate-500 text-[11px] mt-2 mb-1">Applying Initial Conditions:</div>
                  <div className="text-white font-bold">y(x) = cos(2x) + sin(2x)</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Verified by SymPy Core</span>
                <Link to="/differential-equations" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Test In Sandbox →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
