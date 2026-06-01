<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-chart-bar" />
        {{ $t('Quiz Results') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('View student quiz performance and analytics') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Student') }}</th>
            <th>{{ $t('Exam') }}</th>
            <th>{{ $t('Score') }}</th>
            <th>{{ $t('Time Taken') }}</th>
            <th>{{ $t('Date') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="text-center text-medium-emphasis pa-8">
              {{ $t('No quiz results available yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
