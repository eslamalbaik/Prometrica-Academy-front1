<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-school" />
        {{ $t('Enrollments') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Course enrollment management') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Student') }}</th>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Enrolled At') }}</th>
            <th>{{ $t('Progress') }}</th>
            <th>{{ $t('Expires') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="text-center text-medium-emphasis pa-8">
              {{ $t('No active enrollments.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
