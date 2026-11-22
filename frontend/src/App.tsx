import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { CalculusPage } from './pages/calculators/CalculusPage'
import { DifferentialEquationsPage } from './pages/calculators/DifferentialEquationsPage'
import { GraphPlotterPage } from './pages/calculators/GraphPlotterPage'
import { MatrixPage } from './pages/calculators/MatrixPage'
import { NumericalMethodsPage } from './pages/calculators/NumericalMethodsPage'
import { StatisticsPage } from './pages/calculators/StatisticsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { ProgressPage } from './pages/ProgressPage'
import { QuizPage } from './pages/QuizPage'
import { useAuthStore } from './store/authStore'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export const App: React.FC = () => {
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Core Calculators */}
            <Route path="/calculus" element={<CalculusPage />} />
            <Route path="/matrices" element={<MatrixPage />} />
            <Route path="/differential-equations" element={<DifferentialEquationsPage />} />
            <Route path="/numerical-methods" element={<NumericalMethodsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/graph-plotter" element={<GraphPlotterPage />} />

            {/* Student Features */}
            <Route path="/quizzes" element={<QuizPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
