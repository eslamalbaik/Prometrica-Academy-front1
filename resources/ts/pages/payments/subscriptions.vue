<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-repeat" />
        {{ $t('Subscriptions') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage student subscription plans') }}</VCardSubtitle>

      <template #append>
        <VBtn color="primary" prepend-icon="tabler-plus" size="small">
          {{ $t('Create Plan') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText>
      <VRow class="mb-6">
        <VCol v-for="plan in ['Monthly', 'Quarterly', 'Yearly']" :key="plan" cols="12" md="4">
          <VCard variant="outlined" class="text-center pa-6">
            <h5 class="text-h5 mb-2">{{ $t(plan) }}</h5>
            <p class="text-medium-emphasis mb-0">{{ $t('No plan configured') }}</p>
          </VCard>
        </VCol>
      </VRow>

      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Plan Name') }}</th>
            <th>{{ $t('Price') }}</th>
            <th>{{ $t('Billing Cycle') }}</th>
            <th>{{ $t('Active Subscribers') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center text-medium-emphasis pa-8">
              {{ $t('No subscription plans created yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
