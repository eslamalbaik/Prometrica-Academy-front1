import lms from './lms'
import student from './student'
import type { VerticalNavItems } from '@layouts/types'
import { useCookie } from '@core/composable/useCookie'

// Get user data from cookie
const userData = useCookie<any>('userData')
const userRole = userData.value?.role || 'student'

// Serve LMS nav for admins, and Student nav for students
export default (userRole === 'admin' ? [...lms] : [...student]) as VerticalNavItems
