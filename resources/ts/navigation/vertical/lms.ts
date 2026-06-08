export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-layout-dashboard' },
    to: 'dashboards-lms',
  },

  { heading: 'Course Management' },
  {
    title: 'Courses',
    icon: { icon: 'tabler-book-2' },
    children: [
      { title: 'All Courses', to: 'courses' },
      { title: 'Create Course', to: 'courses-create' },
      { title: 'Categories', to: 'courses-categories' },
    ],
  },

  { heading: 'People' },
  {
    title: 'Students',
    icon: { icon: 'tabler-users' },
    children: [
      { title: 'Students List', to: 'students' },
      { title: 'Enrollments', to: 'students-enrollments' },
    ],
  },

  { heading: 'Assessment' },
  {
    title: 'Quizzes',
    icon: { icon: 'tabler-clipboard-check' },
    children: [
      { title: 'Question Bank', to: 'quizzes-bank' },
      { title: 'Exams', to: 'quizzes-exams' },
      { title: 'Results', to: 'quizzes-results' },
    ],
  },

  { heading: 'Finance' },
  {
    title: 'Payments',
    icon: { icon: 'tabler-credit-card' },
    children: [
      { title: 'Transactions', to: 'payments-transactions' },
      { title: 'Coupons', to: 'payments-coupons' },
      { title: 'Subscriptions', to: 'payments-subscriptions' },
    ],
  },
  {
    title: 'Digital Products',
    icon: { icon: 'tabler-shopping-bag' },
    to: 'digital-products',
  },
  {
    title: 'Pricing Plans',
    icon: { icon: 'tabler-layout-grid' },
    to: 'pricing-plans',
  },

  { heading: 'Engagement' },
  {
    title: 'Certificates',
    icon: { icon: 'tabler-certificate' },
    to: 'certificates',
  },
  {
    title: 'Analytics',
    icon: { icon: 'tabler-chart-bar' },
    to: 'analytics',
  },
  {
    title: 'Notifications',
    icon: { icon: 'tabler-bell' },
    to: 'notifications',
  },
  {
    title: 'FAQ',
    icon: { icon: 'tabler-help-circle' },
    to: 'faqs',
  },
  {
    title: 'Media Library',
    icon: { icon: 'tabler-photo' },
    to: 'media',
  },

  { heading: 'System' },
  {
    title: 'Settings',
    icon: { icon: 'tabler-settings' },
    to: 'settings',
  },
]
