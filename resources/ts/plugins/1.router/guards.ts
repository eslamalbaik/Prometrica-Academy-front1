import type { RouteNamedMap, _RouterTyped } from 'unplugin-vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400 })

export const setupGuards = (router: _RouterTyped<RouteNamedMap & { [key: string]: any }>) => {
  router.beforeEach(to => {
    // Start progress bar
    NProgress.start()

    /*
     * Public routes: accessible by everyone without any restrictions.
     */
    if (to.meta.public)
      return

    const isLoggedIn = !!(useCookie('userData').value && useCookie('accessToken').value)

    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn) {
        const userData = useCookie<Record<string, unknown> | null | undefined>('userData')
        const userRole = userData.value?.role as string | undefined
        
        if (userRole === 'admin') {
          return '/dashboards/lms'
        }
        return '/student/dashboard'
      }
      else
        return undefined
    }

    if (!isLoggedIn && to.matched.length) {
      return {
        name: 'login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.path : undefined,
        },
      }
    }

    const userData = useCookie<Record<string, unknown> | null | undefined>('userData')
    const userRole = userData.value?.role as string | undefined

    if (to.meta.requiresAdmin && userRole !== 'admin') {
      return { name: 'not-authorized' }
    }

    if (to.meta.requiresStudent && userRole !== 'student') {
      return { name: 'not-authorized' }
    }
  })

  router.afterEach(() => {
    // Finish progress bar
    NProgress.done()
  })
}
