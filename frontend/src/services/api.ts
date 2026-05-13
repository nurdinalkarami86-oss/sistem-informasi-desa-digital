import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

let axiosInstance: AxiosInstance

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const { token } = useAuthStore.getState()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const getAxiosInstance = () => {
  if (!axiosInstance) {
    axiosInstance = createAxiosInstance()
  }
  return axiosInstance
}

export default getAxiosInstance()
