<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const students = computed(() => dashboardStore.latestStudents)

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const avatarColors = ['primary', 'success', 'info', 'warning', 'error']
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <VCardTitle>{{ $t('Latest Students') }}</VCardTitle>
      <VCardSubtitle>{{ $t('Newly registered users') }}</VCardSubtitle>

      <template #append>
        <VBtn
          variant="tonal"
          size="small"
          :to="{ name: 'students' }"
        >
          {{ $t('View All') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText class="pa-0">
      <VList lines="two">
        <template
          v-for="(student, index) in students"
          :key="student.email"
        >
          <VListItem>
            <template #prepend>
              <VAvatar
                :color="avatarColors[index % avatarColors.length]"
                variant="tonal"
                size="40"
              >
                <span class="text-body-2 font-weight-medium">{{ getInitials(student.name) }}</span>
              </VAvatar>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ student.name }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ student.course }}
            </VListItemSubtitle>

            <template #append>
              <span class="text-caption text-medium-emphasis">{{ $t('1 day ago') }}</span>
            </template>
          </VListItem>
          <VDivider v-if="index < students.length - 1" />
        </template>
      </VList>
    </VCardText>
  </VCard>
</template>
