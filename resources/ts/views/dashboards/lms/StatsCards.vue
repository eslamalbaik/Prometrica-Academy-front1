<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

const stats = computed(() => [
  {
    title: 'Total Students',
    value: dashboardStore.stats.total_students,
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: 'tabler-users',
    color: 'primary',
  },
  {
    title: 'Total Revenue',
    value: 'SAR ' + dashboardStore.stats.total_revenue,
    change: '+8.3%',
    changeType: 'positive' as const,
    icon: 'tabler-currency-riyal',
    color: 'success',
  },
  {
    title: 'Total Enrollments',
    value: dashboardStore.stats.total_enrollments,
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: 'tabler-clipboard-check',
    color: 'info',
  },
  {
    title: 'Active Courses',
    value: dashboardStore.stats.active_courses,
    change: '+2',
    changeType: 'positive' as const,
    icon: 'tabler-book-2',
    color: 'warning',
  },
  {
    title: 'Certificates Issued',
    value: dashboardStore.stats.certificates_issued || '0',
    change: '+3.1%',
    changeType: 'positive' as const,
    icon: 'tabler-certificate',
    color: 'secondary',
  },
  {
    title: 'Monthly Revenue',
    value: 'SAR 0',
    change: '0%',
    changeType: 'positive' as const,
    icon: 'tabler-trending-up',
    color: 'error',
  },
])
</script>

<template>
  <VRow>
    <VCol
      v-for="stat in stats"
      :key="stat.title"
      cols="12"
      sm="6"
      lg="4"
      xl="2"
    >
      <VCard class="stats-card">
        <VCardText class="d-flex align-center gap-4">
          <VAvatar
            :color="stat.color"
            variant="tonal"
            size="48"
            rounded
          >
            <VIcon
              :icon="stat.icon"
              size="28"
            />
          </VAvatar>

          <div class="d-flex flex-column">
            <span class="text-body-2 text-medium-emphasis">{{ $t(stat.title) }}</span>
            <div class="d-flex align-center gap-2">
              <h4 class="text-h4 font-weight-semibold">
                {{ stat.value }}
              </h4>
              <VChip
                :color="stat.changeType === 'positive' ? 'success' : 'error'"
                size="x-small"
                label
              >
                <VIcon
                  :icon="stat.changeType === 'positive' ? 'tabler-arrow-up' : 'tabler-arrow-down'"
                  size="12"
                  start
                />
                {{ stat.change }}
              </VChip>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.stats-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px rgba(var(--v-theme-on-surface), 0.08) !important;
}
</style>
