<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-users" />
        {{ $t('Students') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage all registered students') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Email') }}</th>
            <th>{{ $t('Phone') }}</th>
            <th>{{ $t('Country') }}</th>
            <th>{{ $t('Enrolled') }}</th>
            <th>{{ $t('Last Login') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="8" class="text-center text-medium-emphasis pa-8">
              {{ $t('No students registered yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
