import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { authApi } from '../services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, pass: string) => Promise<boolean>
  register: (email: string, name: string, pass: string) => Promise<boolean>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, pass: string) => {
        set({ isLoading: true, error: null })
        try {
          const data = await authApi.login(email, pass)
          localStorage.setItem('educal_token', data.access_token)
          set({ token: data.access_token, isAuthenticated: true })
          await get().fetchUser()
          return true
        } catch (err: any) {
          const msg = err.response?.data?.detail || 'Invalid email or password'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      register: async (email: string, name: string, pass: string) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.register(email, name, pass)
          // Auto login upon successful registration
          return await get().login(email, pass)
        } catch (err: any) {
          const msg = err.response?.data?.detail || 'Registration failed'
          set({ error: msg, isLoading: false })
          return false
        }
      },

      logout: () => {
        localStorage.removeItem('educal_token')
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      fetchUser: async () => {
        const token = localStorage.getItem('educal_token')
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }
        try {
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          localStorage.removeItem('educal_token')
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'educal_auth_session',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
