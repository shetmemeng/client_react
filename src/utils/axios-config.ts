import axios from 'axios'

export const BASE_URL = "https://server-express-c8na.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const statusCode = error.response?.status
    if (statusCode === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('session');
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
