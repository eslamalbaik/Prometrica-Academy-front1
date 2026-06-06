<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

definePage({
  meta: {
    requiresAdmin: true
  }
})

const router = useRouter()
const { t } = useI18n()

const page = ref(1)
const dbNotifications = ref<any[]>([])
const notifications = ref<any[]>([])
const unreadCount = ref(0)
const totalPages = ref(1)
const isLoading = ref(false)

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const mapNotifications = () => {
  notifications.value = dbNotifications.value.map(n => {
    const d = n.data || {}
    let titleKey = ''
    let descKey = ''
    let color = 'primary'
    let icon = 'tabler-bell'
    
    if (d.type === 'course_rated') {
      titleKey = 'notifications.course_rated_title'
      descKey = 'notifications.course_rated_desc'
      color = 'primary'
      icon = 'tabler-star'
    } else if (d.type === 'course_commented') {
      titleKey = 'notifications.course_commented_title'
      descKey = 'notifications.course_commented_desc'
      color = 'warning'
      icon = 'tabler-message'
    } else if (d.type === 'course_completed') {
      titleKey = 'notifications.course_completed_title'
      descKey = 'notifications.course_completed_desc'
      color = 'success'
      icon = 'tabler-trophy'
    } else {
      titleKey = 'notifications.title'
    }

    const message = descKey 
      ? t(descKey, {
          student: d.student_name || 'Student',
          course: d.course_title || '',
          rating: d.rating || '',
          lesson: d.lesson_title || ''
        })
      : d.message || ''

    return {
      id: n.id,
      title: t(titleKey),
      message,
      time: formatTime(n.created_at),
      isSeen: n.read_at !== null,
      color,
      icon,
      courseId: d.course_id
    }
  })
}

const fetchNotifications = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/admin/notifications?page=${page.value}`)
    const paginator = res.data.notifications
    dbNotifications.value = paginator.data || []
    unreadCount.value = res.data.unread_count || 0
    totalPages.value = paginator.last_page || 1
    mapNotifications()
  } catch (err) {
    console.error('Error fetching notifications:', err)
  } finally {
    isLoading.value = false
  }
}

const markAsRead = async (id: string) => {
  try {
    await api.patch(`/api/admin/notifications/${id}/mark-as-read`)
    // Optimistic local update
    const item = notifications.value.find(n => n.id === id)
    if (item) {
      item.isSeen = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } catch (err) {
    console.error(err)
  }
}

const markAllRead = async () => {
  try {
    await api.patch('/api/admin/notifications/mark-all-read')
    notifications.value.forEach(n => n.isSeen = true)
    unreadCount.value = 0
  } catch (err) {
    console.error(err)
  }
}

const handleNotificationClick = (item: any) => {
  if (!item.isSeen) {
    markAsRead(item.id)
  }
  if (item.courseId) {
    router.push(`/courses/${item.courseId}/builder`)
  }
}

watch(page, fetchNotifications)

onMounted(fetchNotifications)
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <h3 class="text-h3 mb-1">
          {{ $t('notifications.inbox_title') }}
        </h3>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">
          {{ $t('notifications.inbox_subtitle') }}
        </p>
      </div>
      <div>
        <VBtn
          v-if="unreadCount > 0"
          prepend-icon="tabler-mail-opened"
          variant="tonal"
          color="primary"
          @click="markAllRead"
        >
          {{ $t('notifications.mark_all_read_btn') }}
        </VBtn>
      </div>
    </div>

    <!-- Notifications Card -->
    <VCard>
      <VProgressLinear
        v-if="isLoading"
        indeterminate
        color="primary"
      />

      <VCardText v-if="!isLoading && notifications.length === 0" class="text-center py-12">
        <VIcon
          icon="tabler-mail-opened"
          size="64"
          color="disabled"
          class="mb-3"
        />
        <p class="text-h6 text-medium-emphasis mb-0">
          {{ $t('notifications.all_read_message') }}
        </p>
      </VCardText>

      <VList v-else class="py-0">
        <template v-for="(item, index) in notifications" :key="item.id">
          <VDivider v-if="index > 0" />
          
          <VListItem
            link
            @click="handleNotificationClick(item)"
            :class="[!item.isSeen ? 'bg-var-theme-background-selected font-weight-medium' : '']"
            class="py-4"
          >
            <!-- Prepend Icon -->
            <template #prepend>
              <VAvatar
                :color="item.color"
                variant="tonal"
                class="me-4"
              >
                <VIcon :icon="item.icon" size="22" />
              </VAvatar>
            </template>

            <!-- Title & Message -->
            <VListItemTitle class="text-h6 mb-1 d-flex align-center gap-2">
              {{ item.title }}
              <VBadge
                v-if="!item.isSeen"
                dot
                inline
                color="primary"
              />
            </VListItemTitle>
            <VListItemSubtitle class="text-body-1 text-high-emphasis">
              {{ item.message }}
            </VListItemSubtitle>

            <!-- Time & Actions -->
            <template #append>
              <div class="d-flex align-center gap-4">
                <span class="text-sm text-medium-emphasis">{{ item.time }}</span>
                <IconBtn
                  v-if="!item.isSeen"
                  color="primary"
                  @click.stop="markAsRead(item.id)"
                >
                  <VIcon icon="tabler-check" size="20" />
                  <VTooltip activator="parent" location="top">
                    Mark as Read
                  </VTooltip>
                </IconBtn>
              </div>
            </template>
          </VListItem>
        </template>
      </VList>
    </VCard>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <VPagination
        v-model="page"
        :length="totalPages"
        total-visible="7"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg-var-theme-background-selected {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
