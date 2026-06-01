<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-database" />
        {{ $t('Question Bank') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage quiz questions across all courses') }}</VCardSubtitle>

      <template #append>
        <VBtn color="primary" prepend-icon="tabler-plus" size="small">
          {{ $t('Add Question') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Question') }}</th>
            <th>{{ $t('Type') }}</th>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Difficulty') }}</th>
            <th>{{ $t('Points') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="5" class="text-center text-medium-emphasis pa-8">
              {{ $t('No questions in the bank yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
