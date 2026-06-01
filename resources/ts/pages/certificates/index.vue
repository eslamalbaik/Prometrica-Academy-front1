<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-certificate" />
        {{ $t('Certificates') }}
        <VSpacer />
        <VBtn color="primary" prepend-icon="tabler-plus" size="small">
          {{ $t('Add Template') }}
        </VBtn>
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage certificate templates and issued certificates') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VTabs class="mb-6">
        <VTab>{{ $t('Issued Certificates') }}</VTab>
        <VTab>{{ $t('Templates') }}</VTab>
      </VTabs>

      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Template Name') }}</th>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Issued Count') }}</th>
            <th>{{ $t('Created At') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center text-medium-emphasis pa-8">
              {{ $t('No certificates templates yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
