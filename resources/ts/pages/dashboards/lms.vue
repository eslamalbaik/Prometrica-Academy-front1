<script setup lang="ts">
import { defineAsyncComponent, onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

// Aggressive Lazy Loading for heavy components
const StatsCards = defineAsyncComponent(() => import('@/views/dashboards/lms/StatsCards.vue'))
const RevenueChart = defineAsyncComponent(() => import('@/views/dashboards/lms/RevenueChart.vue'))
const StudentGrowthChart = defineAsyncComponent(() => import('@/views/dashboards/lms/StudentGrowthChart.vue'))
const CourseEngagementChart = defineAsyncComponent(() => import('@/views/dashboards/lms/CourseEngagementChart.vue'))
const LatestPayments = defineAsyncComponent(() => import('@/views/dashboards/lms/LatestPayments.vue'))
const LatestStudents = defineAsyncComponent(() => import('@/views/dashboards/lms/LatestStudents.vue'))
const RecentActivities = defineAsyncComponent(() => import('@/views/dashboards/lms/RecentActivities.vue'))
const CompletionRateChart = defineAsyncComponent(() => import('@/views/dashboards/lms/CompletionRateChart.vue'))

definePage({
  meta: {
    requiresAdmin: true,
  },
})

const dashboardStore = useDashboardStore()
const isLoading = computed(() => dashboardStore.isLoading)

onMounted(() => {
  dashboardStore.fetchDashboardData()
})

const handleRefresh = () => {
  dashboardStore.fetchDashboardData(true)
}
</script>

<template>
  <div>
    <!-- Header with Refresh Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">LMS Dashboard</h1>
      <VBtn
        color="primary"
        variant="tonal"
        prepend-icon="tabler-refresh"
        :loading="isLoading"
        @click="handleRefresh"
      >
        Refresh
      </VBtn>
    </div>

    <!-- Stats Cards Row (Zero CLS container) -->
    <div style="min-height: 120px;" class="mb-6">
      <VRow v-if="isLoading">
        <VCol v-for="i in 4" :key="i" cols="12" md="3">
          <VSkeletonLoader type="list-item-avatar, text" />
        </VCol>
      </VRow>
      <StatsCards v-else />
    </div>

    <VRow>
      <!-- Revenue Chart -->
      <VCol cols="12" lg="8">
        <div style="min-height: 400px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="image" height="400" />
          <RevenueChart v-else />
        </div>
      </VCol>

      <!-- Completion Rate -->
      <VCol cols="12" lg="4">
        <div style="min-height: 400px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="image" height="400" />
          <CompletionRateChart v-else />
        </div>
      </VCol>
    </VRow>

    <VRow>
      <!-- Student Growth -->
      <VCol cols="12" md="6">
        <div style="min-height: 350px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="image" height="350" />
          <StudentGrowthChart v-else />
        </div>
      </VCol>

      <!-- Course Engagement -->
      <VCol cols="12" md="6">
        <div style="min-height: 350px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="image" height="350" />
          <CourseEngagementChart v-else />
        </div>
      </VCol>
    </VRow>

    <VRow>
      <!-- Latest Payments -->
      <VCol cols="12" lg="4">
        <div style="min-height: 450px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="list-item-avatar-two-line@5" height="450" />
          <LatestPayments v-else />
        </div>
      </VCol>

      <!-- Latest Students -->
      <VCol cols="12" lg="4">
        <div style="min-height: 450px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="list-item-avatar-two-line@5" height="450" />
          <LatestStudents v-else />
        </div>
      </VCol>

      <!-- Recent Activities -->
      <VCol cols="12" lg="4">
        <div style="min-height: 450px; position: relative;">
          <VSkeletonLoader v-if="isLoading" type="list-item-two-line@5" height="450" />
          <RecentActivities v-else />
        </div>
      </VCol>
    </VRow>
  </div>
</template>
