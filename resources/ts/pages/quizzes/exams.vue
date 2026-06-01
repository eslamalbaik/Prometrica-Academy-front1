<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-clipboard-list" />
        {{ $t('Exams & Quizzes') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage assessments') }}</VCardSubtitle>

      <template #append>
        <VBtn color="primary" prepend-icon="tabler-plus" size="small">
          {{ $t('Create Exam') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Exam Title') }}</th>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Questions') }}</th>
            <th>{{ $t('Time Limit') }}</th>
            <th>{{ $t('Passing Score') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="text-center text-medium-emphasis pa-8">
              {{ $t('No exams created yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
