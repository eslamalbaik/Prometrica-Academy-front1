<script lang="ts" setup>
import type { Notification } from '@layouts/types'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const dbNotifications = ref<any[]>([])
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const router = useRouter()
const { t } = useI18n()

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const mapNotifications = () => {
  notifications.value = dbNotifications.value.map(n => {
    const d = n.data || {}
    let title = ''
    let subtitle = ''
    let color = 'primary'
    let icon = 'tabler-bell'
    
    if (d.type === 'course_rated') {
      title = 'notifications.course_rated_title'
      subtitle = 'notifications.course_rated_desc'
      color = 'primary'
      icon = 'tabler-star'
    } else if (d.type === 'course_commented') {
      title = 'notifications.course_commented_title'
      subtitle = 'notifications.course_commented_desc'
      color = 'warning'
      icon = 'tabler-message'
    } else if (d.type === 'course_completed') {
      title = 'notifications.course_completed_title'
      subtitle = 'notifications.course_completed_desc'
      color = 'success'
      icon = 'tabler-trophy'
    } else {
      title = 'notifications.title'
      subtitle = d.message || ''
    }

    return {
      id: n.id,
      title: t(title),
      subtitle: t(subtitle, {
        student: d.student_name || 'Student',
        course: d.course_title || '',
        rating: d.rating || '',
        lesson: d.lesson_title || ''
      }),
      time: formatTime(n.created_at),
      isSeen: n.read_at !== null,
      color,
      icon,
    } as any
  })
}

const fetchNotifications = async () => {
  try {
    const res = await api.get('/api/admin/notifications')
    dbNotifications.value = res.data.notifications.data || []
    unreadCount.value = res.data.unread_count || 0
    mapNotifications()
  } catch (err) {
    console.error('Error fetching notifications:', err)
  }
}

const removeNotification = async (notificationId: string | number) => {
  try {
    await api.patch(`/api/admin/notifications/${notificationId}/mark-as-read`)
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  } catch (err) {
    console.error(err)
  }
}

const markRead = async (notificationIds: (string | number)[]) => {
  try {
    // Optimistic update
    notifications.value.forEach(item => {
      if (notificationIds.includes(item.id)) {
        item.isSeen = true
      }
    })
    
    for (const id of notificationIds) {
      await api.patch(`/api/admin/notifications/${id}/mark-as-read`)
    }
    
    await fetchNotifications()
  } catch (err) {
    console.error(err)
  }
}

const markUnRead = (notificationIds: (string | number)[]) => {
  notifications.value.forEach(item => {
    if (notificationIds.includes(item.id)) {
      item.isSeen = false
    }
  })
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isSeen) {
    await markRead([notification.id])
  }
  
  const dbN = dbNotifications.value.find(n => n.id === notification.id)
  if (dbN && dbN.data) {
    const d = dbN.data
    if (d.course_id) {
      router.push(`/courses/${d.course_id}/builder`)
    }
  }
}

onMounted(() => {
  fetchNotifications()
  
  // Refresh notifications every 60 seconds
  const interval = setInterval(fetchNotifications, 60000)
  onBeforeUnmount(() => clearInterval(interval))
})
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
