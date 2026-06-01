<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()
const payments = computed(() => dashboardStore.latestPayments)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'success'
    case 'Pending': return 'warning'
    case 'Refunded': return 'error'
    default: return 'secondary'
  }
}

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'Mada': return 'tabler-credit-card'
    case 'Visa': return 'tabler-brand-visa'
    case 'Mastercard': return 'tabler-brand-mastercard'
    case 'Apple Pay': return 'tabler-brand-apple'
    case 'STC Pay': return 'tabler-device-mobile'
    default: return 'tabler-credit-card'
  }
}
</script>

<template>
  <VCard class="h-100">
    <VCardItem>
      <VCardTitle>{{ $t('Latest Payments') }}</VCardTitle>
      <VCardSubtitle>{{ $t('Recent transactions') }}</VCardSubtitle>

      <template #append>
        <VBtn
          variant="tonal"
          size="small"
          :to="{ name: 'payments-transactions' }"
        >
          {{ $t('View All') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText class="pa-0">
      <VList lines="two">
        <template
          v-for="(payment, index) in payments"
          :key="payment.id"
        >
          <VListItem>
            <template #prepend>
              <VAvatar
                color="primary"
                variant="tonal"
                size="40"
                rounded
              >
                <VIcon :icon="getMethodIcon(payment.method)" size="22" />
              </VAvatar>
            </template>

            <VListItemTitle class="font-weight-medium">
              {{ payment.student }}
            </VListItemTitle>
            <VListItemSubtitle>
              #INV-{{ payment.id }} · {{ $t('Mada') }}
            </VListItemSubtitle>>

            <template #append>
              <div class="d-flex flex-column align-end">
                <span class="text-body-1 font-weight-semibold">SAR 450</span>
                <VChip
                  :color="getStatusColor(payment.status)"
                  size="x-small"
                  label
                >
                  {{ $t('Completed') }}
                </VChip>
              </div>
            </template>
          </VListItem>
          <VDivider v-if="index < payments.length - 1" />
        </template>
      </VList>
    </VCardText>
  </VCard>
</template>
