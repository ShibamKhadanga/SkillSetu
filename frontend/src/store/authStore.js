import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          const { user, token } = res.data.data
          set({ user, token, isAuthenticated: true, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          return { success: true, user }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', data)
          const { user, token } = res.data.data
          set({ user, token, isAuthenticated: true, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          return { success: true, user }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      googleLogin: async (googleToken) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/google', { token: googleToken })
          const { user, token } = res.data.data
          set({ user, token, isAuthenticated: true, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          return { success: true, user }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        delete api.defaults.headers.common['Authorization']
      },

      updateUser: (data) => {
        set({ user: { ...get().user, ...data } })
      },
    }),
    {
      name: 'skillsetu-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)