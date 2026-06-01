import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

// Add a request interceptor to handle tokens or extra headers if needed
axiosIns.interceptors.request.use(config => {
  return config
})

export default axiosIns
