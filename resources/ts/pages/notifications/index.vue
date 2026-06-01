<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-bell" />
        {{ $t('Notifications') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('System notifications and alerts') }}</VCardSubtitle>

      <template #append>
        <VBtn variant="tonal" size="small">
          {{ $t('Mark All Read') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText>
      <div class="text-center text-medium-emphasis pa-8">
        <VIcon icon="tabler-bell-off" size="48" class="mb-4 text-disabled" />
        <p>{{ $t('No notifications yet') }}</p>
      </div>
    </VCardText>
  </VCard>
</template>
