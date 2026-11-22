import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  BookOpen,
  Calculator,
  Compass,
  Cpu,
  GraduationCap,
  Grid,
  LineChart,
  LogOut,
  Menu,
  Sigma,
  TrendingUp,
  User as UserIcon,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Calculus', path: '/calculus', icon: Sigma },
    { name: 'Matrices', path: '/matrices', icon: Grid },
    { name: 'ODEs', path: '/differential-equations', icon: Cpu },
    { name: 'Numerical', path: '/numerical-methods', icon: Activity },
    { name: 'Statistics', path: '/statistics', icon: BarChart3 },
    { name: 'Grapher', path: '/graph-plotter', icon: LineChart },
    { name: 'Quizzes', path: '/quizzes', icon: BookOpen },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Educal
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold -mt-1">
                Engineering Math
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500/50 text-xs font-medium transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-900 hover:text-indigo-400"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{link.name}</span>
              </Link>
            )
          })}
          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-slate-900 text-slate-200 text-xs font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
