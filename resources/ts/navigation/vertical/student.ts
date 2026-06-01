export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-layout-dashboard' },
    to: 'student-dashboard', // This matches student/dashboard.vue route name
  },
  { heading: 'Learning' },
  {
    title: 'My Courses',
    icon: { icon: 'tabler-book' },
    to: 'student-courses', // Assuming this exists or will exist
  },
  {
    title: 'Certificates',
    icon: { icon: 'tabler-certificate' },
    to: 'certificates',
  }
]
