export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface CalculusResult {
  result: string
  latex?: string
  numeric?: number
  steps?: string[]
}

export interface MatrixResult {
  result: any
  latex?: string
  steps?: string[]
}

export interface ODEResult {
  result: string
  latex?: string
  general_solution?: string
  particular_solution?: string
}

export interface NumericalResult {
  result: any
  iterations?: number
  converged?: boolean
  error?: number
  steps?: Array<Record<string, any>>
}

export interface StatisticsResult {
  result: Record<string, any>
  plot_data?: {
    histogram?: {
      x: number[]
      y: number[]
    }
  }
}

export interface GraphTrace {
  x: number[]
  y: (number | null)[]
  type: string
  mode: string
  name: string
  line?: { color: string; width: number }
  error?: string
}

export interface GraphResult {
  traces: GraphTrace[]
  layout: Record<string, any>
}

export interface Question {
  id: number
  text: string
  options: string[]
  points: number
}

export interface Quiz {
  id: number
  title: string
  topic: string
  difficulty: string
  description?: string
  questions: Question[]
}

export interface QuizSubmission {
  quiz_id: number
  answers: Record<number, number>
}

export interface QuizResult {
  quiz_id: number
  score: number
  total_points: number
  percentage: number
  correct_answers: number
  total_questions: number
  explanations: Record<number, string>
}

export interface ProgressData {
  user_id: number
  topic_scores: Record<string, number>
  quizzes_completed: number
  calculations_done: number
  streak_days: number
  last_active: string
}

export interface CalculationHistoryItem {
  id: number
  topic: string
  operation: string
  input_data: Record<string, any>
  result_data: Record<string, any>
  created_at: string
}
