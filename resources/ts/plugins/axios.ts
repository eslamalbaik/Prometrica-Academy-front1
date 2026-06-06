import axios from 'axios'

const apiBaseUrl = 'http://localhost:8000'

// 1. Origin Auditing Warning
if (typeof window !== 'undefined' && window.location) {
  try {
    const apiOrigin = new URL(apiBaseUrl).origin
    if (window.location.origin !== apiOrigin) {
      console.warn('[Sanctum Config] Origin mismatch detected. Cookies may be dropped.')
    }
  } catch (e) {
    console.error('[Sanctum Config] Failed to parse API base URL for origin audit.', e)
  }
}

const axiosIns = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

// 2. Idempotent Interceptor Registration (Clear existing handlers)
axiosIns.interceptors.request.clear()
axiosIns.interceptors.response.clear()

// Request Interceptor
axiosIns.interceptors.request.use(config => {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// 3. CSRF Mutex Variables
let isRefreshing = false
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response Interceptor
axiosIns.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    // Handle 419 CSRF Token Mismatch
    if (error.response && error.response.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return axiosIns(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      return axiosIns.get('/sanctum/csrf-cookie')
        .then(() => {
          processQueue(null, 'csrf-cookie-retrieved')
          return axiosIns(originalRequest)
        })
        .catch(err => {
          processQueue(err, null)
          return Promise.reject(err)
        })
        .finally(() => {
          isRefreshing = false
        })
    }

    // Handle 401 Unauthorized errors (session expired)
    if (error.response && error.response.status === 401) {
      // If the 401 comes from the /api/user check, it's just a guest checking auth state. Do not redirect.
      if (error.config && (error.config.url === '/api/user' || error.config.url?.endsWith('/api/user'))) {
        return Promise.reject(error)
      }

      // Clear auth state in store
      import('@/stores/authStore')
        .then(({ useAuthStore }) => {
          useAuthStore().logout()
        })
        .catch(e => {
          // Ignore if store not available
        })
      
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userData')
      }

      // Redirect to correct login page depending on the section of the site
      const currentPath = window.location.pathname
      const isAdminSection = currentPath.startsWith('/admin') || currentPath.startsWith('/dashboards')
      const targetLoginPath = isAdminSection ? '/admin/login' : '/login'

      if (currentPath !== '/login' && currentPath !== '/admin/login') {
        window.location.href = targetLoginPath
      }
    }

    return Promise.reject(error)
  }
)

export default axiosIns
