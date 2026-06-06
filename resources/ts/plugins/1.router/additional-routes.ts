import type { RouteRecordRaw } from 'vue-router/auto'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    beforeEnter: (to, from) => {
      // تحويل قسري خارج سيرفر Vuexy تماماً والذهاب لصفحة الهبوط الجديدة
      window.location.href = 'http://localhost:8080/'
      return false // إيقاف محرك Vue عن إكمال التنقل داخلياً
    }
  }
]

// 👉 Additional routes (non file-based)
export const routes: RouteRecordRaw[] = []
