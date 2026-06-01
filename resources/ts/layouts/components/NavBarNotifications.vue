<script lang="ts" setup>
import type { Notification } from '@layouts/types'

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'New course available',
    subtitle: 'Clinical Pharmacology 101 is now open.',
    time: 'Today',
    isSeen: false,
    color: 'primary',
  },
  {
    id: 2,
    title: 'Quiz graded',
    subtitle: 'Your quiz results are ready.',
    time: 'Yesterday',
    isSeen: true,
    color: 'success',
  },
  {
    id: 3,
    title: 'System Update',
    subtitle: 'Platform maintenance scheduled for Sunday.',
    time: '11 Aug',
    isSeen: true,
    color: 'warning',
  },
])

const removeNotification = (notificationId: number) => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = (notificationId: number[]) => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = (notificationId: number[]) => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = (notification: Notification) => {
  if (!notification.isSeen)
    markRead([notification.id])
}
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
