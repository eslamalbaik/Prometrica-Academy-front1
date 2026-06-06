import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import api from '@/plugins/axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    total_students: 0,
    active_courses: 0,
    total_enrollments: 0,
    total_revenue: 0,
    certificates_issued: 0
  })
  
  // Use shallowRef for arrays to completely bypass Vue's deep reactivity overhead (saves CPU/TBT)
  const latestStudents = shallowRef<any[]>([])
  const latestPayments = shallowRef<any[]>([])
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false)

  const fetchDashboardData = async (forceRefresh = false) => {
    if (isLoaded.value && !forceRefresh) {
      return // Instant memory cache (serves from RAM)
    }

    isLoading.value = true
    error.value = null

    try {
      // Hit the single highly-optimized endpoint
      const response = await api.get('/api/dashboard/stats')
      
      const data = response?.data || {}
      stats.value = data?.stats || {
        total_students: 0,
        active_courses: 0,
        total_enrollments: 0,
        total_revenue: 0,
        certificates_issued: 0
      }
      
      // Strict fallback arrays to prevent NaN rendering loops in ApexCharts
      latestStudents.value = data?.latestStudents?.length ? data.latestStudents : []
      latestPayments.value = data?.latestPayments?.length ? data.latestPayments : []
      
      isLoaded.value = true
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch dashboard data'
      console.error('Error fetching dashboard data:', err)
      
      // Fallback on error to ensure UI does not break
      stats.value = { total_students: 0, active_courses: 0, total_enrollments: 0, total_revenue: 0, certificates_issued: 0 }
      latestStudents.value = []
      latestPayments.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    latestStudents,
    latestPayments,
    isLoading,
    error,
    isLoaded,
    fetchDashboardData
  }
})
