import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const axiosIns = axios.create({
  baseURL: apiBaseUrl,
  // 20s — `php artisan serve` rebuilds config/routes on a cold first request,
  // so cold login (~4s) + CORS preflight (~1s) can spike. 8s was too tight.
  timeout: 20000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

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

// Response Interceptor
axiosIns.interceptors.response.use(
  response => response,
  error => {
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
