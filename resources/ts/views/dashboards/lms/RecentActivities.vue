<script setup lang="ts">
const activities = ref([
  {
    title: 'New course published',
    description: 'Clinical Pharmacology Advanced was published',
    time: '10 min ago',
    icon: 'tabler-book-upload',
    color: 'success',
  },
  {
    title: 'Payment received',
    description: 'SAR 450 from Ahmed Al-Rashid',
    time: '25 min ago',
    icon: 'tabler-cash',
    color: 'primary',
  },
  {
    title: 'Quiz completed',
    description: 'Fatima Hassan scored 92% on Drug Interactions Quiz',
    time: '1 hour ago',
    icon: 'tabler-clipboard-check',
    color: 'info',
  },
  {
    title: 'Certificate issued',
    description: 'Omar Khalil completed Pharmacology 101',
    time: '2 hours ago',
    icon: 'tabler-certificate',
    color: 'warning',
  },
  {
    title: 'New student enrolled',
    description: 'Sara Mohamed enrolled in Clinical Pharmacy',
    time: '3 hours ago',
    icon: 'tabler-user-plus',
    color: 'secondary',
  },
  {
    title: 'Subscription renewed',
    description: 'Khalid Nasser renewed yearly plan',
    time: '5 hours ago',
    icon: 'tabler-refresh',
    color: 'success',
  },
])
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <VCardTitle>{{ $t('Recent Activities') }}</VCardTitle>
      <VCardSubtitle>{{ $t('Platform events') }}</VCardSubtitle>
    </VCardItem>

    <VCardText class="pa-0">
      <VTimeline
        density="compact"
        align="start"
        truncate-line="both"
        class="px-5 pb-4"
      >
        <VTimelineItem
          v-for="activity in activities"
          :key="activity.title"
          :dot-color="activity.color"
          size="x-small"
        >
          <div class="d-flex justify-space-between align-start flex-wrap">
            <div>
              <p class="text-body-1 font-weight-medium mb-0">
                {{ $t(activity.title) }}
              </p>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ $t(activity.description) }}
              </p>
            </div>
            <span class="text-caption text-medium-emphasis text-no-wrap">{{ $t(activity.time) }}</span>
          </div>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
