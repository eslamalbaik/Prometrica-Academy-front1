import type { RouteRecordRaw } from 'vue-router/auto'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    beforeEnter: (to, from) => {
      // تحويل لصفحة الهبوط الرئيسية
      window.location.href = import.meta.env.VITE_LANDING_URL || 'https://prometricaacademy.org'
      return false // إيقاف محرك Vue عن إكمال التنقل داخلياً
    }
  }
]

// 👉 Additional routes (non file-based)
export const routes: RouteRecordRaw[] = []
