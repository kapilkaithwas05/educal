import axios from 'axios'
import type {
  CalculusResult,
  CalculationHistoryItem,
  GraphResult,
  MatrixResult,
  NumericalResult,
  ODEResult,
  ProgressData,
  Quiz,
  QuizResult,
  QuizSubmission,
  StatisticsResult,
  TokenResponse,
  User,
} from '../types'

// Use VITE_API_URL if configured (production domain), otherwise default to relative path /api/v1 (dev proxy)
const BASE_HOST = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : ''
const API_BASE = `${BASE_HOST}/api/v1`

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token from localStorage if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('educal_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const res = await axios.post<TokenResponse>(`${API_BASE}/auth/token`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  },

  register: async (email: string, full_name: string, password: string): Promise<User> => {
    const res = await apiClient.post<User>('/auth/register', { email, full_name, password })
    return res.data
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/users/me')
    return res.data
  },

  updateMe: async (data: { full_name?: string; password?: string }): Promise<User> => {
    const res = await apiClient.patch<User>('/users/me', data)
    return res.data
  },
}

// Calculus API
export const calculusApi = {
  derivative: async (data: { expression: string; variable?: string; order?: number }) => {
    const res = await apiClient.post<CalculusResult>('/calculus/derivative', data)
    return res.data
  },
  integral: async (data: { expression: string; variable?: string; lower_bound?: number; upper_bound?: number }) => {
    const res = await apiClient.post<CalculusResult>('/calculus/integral', data)
    return res.data
  },
  limit: async (data: { expression: string; variable?: string; point?: number }) => {
    const res = await apiClient.post<CalculusResult>('/calculus/limit', data)
    return res.data
  },
  taylor: async (data: { expression: string; variable?: string; point?: number; order?: number }) => {
    const res = await apiClient.post<CalculusResult>('/calculus/taylor', data)
    return res.data
  },
}

// Matrix API
export const matrixApi = {
  determinant: async (matrix_a: number[][]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/determinant', { matrix_a })
    return res.data
  },
  inverse: async (matrix_a: number[][]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/inverse', { matrix_a })
    return res.data
  },
  eigenvalues: async (matrix_a: number[][]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/eigenvalues', { matrix_a })
    return res.data
  },
  rank: async (matrix_a: number[][]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/rank', { matrix_a })
    return res.data
  },
  multiply: async (matrix_a: number[][], matrix_b: number[][]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/multiply', { matrix_a, matrix_b })
    return res.data
  },
  solve: async (matrix_a: number[][], vector_b: number[]) => {
    const res = await apiClient.post<MatrixResult>('/matrices/solve', { matrix_a, vector_b })
    return res.data
  },
}

// ODE API
export const odeApi = {
  solve: async (data: { equation: string; variable?: string; function?: string; initial_conditions?: Record<string, number> }) => {
    const res = await apiClient.post<ODEResult>('/odes/solve', data)
    return res.data
  },
}

// Numerical Methods API
export const numericalApi = {
  bisection: async (data: { expression: string; variable?: string; a: number; b: number; tolerance?: number }) => {
    const res = await apiClient.post<NumericalResult>('/numerical/bisection', data)
    return res.data
  },
  newtonRaphson: async (data: { expression: string; variable?: string; initial_guess: number; tolerance?: number }) => {
    const res = await apiClient.post<NumericalResult>('/numerical/newton-raphson', data)
    return res.data
  },
  rungeKutta: async (data: { expression: string; variable?: string; a?: number; b?: number; h?: number; y0?: number }) => {
    const res = await apiClient.post<NumericalResult>('/numerical/runge-kutta', data)
    return res.data
  },
  integration: async (data: { expression: string; variable?: string; a: number; b: number; n?: number }) => {
    const res = await apiClient.post<NumericalResult>('/numerical/integration', data)
    return res.data
  },
}

// Statistics API
export const statsApi = {
  descriptive: async (data: number[]) => {
    const res = await apiClient.post<StatisticsResult>('/statistics/descriptive', { data })
    return res.data
  },
  regression: async (x_data: number[], y_data: number[], regression_type?: string) => {
    const res = await apiClient.post<StatisticsResult>('/statistics/regression', { x_data, y_data, regression_type })
    return res.data
  },
}

// Graphing API
export const graphApi = {
  plot: async (data: { expressions: string[]; variable?: string; x_min?: number; x_max?: number; points?: number }) => {
    const res = await apiClient.post<GraphResult>('/graphing/plot', data)
    return res.data
  },
}

// Quizzes & Progress
export const quizApi = {
  list: async (topic?: string) => {
    const res = await apiClient.get<Quiz[]>('/quizzes/', { params: topic ? { topic } : {} })
    return res.data
  },
  get: async (id: number) => {
    const res = await apiClient.get<Quiz>(`/quizzes/${id}`)
    return res.data
  },
  submit: async (data: QuizSubmission) => {
    const res = await apiClient.post<QuizResult>('/quizzes/submit', data)
    return res.data
  },
}

export const progressApi = {
  get: async () => {
    const res = await apiClient.get<ProgressData>('/progress/')
    return res.data
  },
}

export const historyApi = {
  list: async (skip = 0, limit = 20, topic?: string) => {
    const res = await apiClient.get<CalculationHistoryItem[]>('/history/', {
      params: { skip, limit, ...(topic ? { topic } : {}) },
    })
    return res.data
  },
  delete: async (id: number) => {
    await apiClient.delete(`/history/${id}`)
  },
}
