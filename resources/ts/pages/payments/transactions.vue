<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-receipt" />
        {{ $t('Transactions') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('Payment transaction history') }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Transaction ID') }}</th>
            <th>{{ $t('Student') }}</th>
            <th>{{ $t('Amount') }}</th>
            <th>{{ $t('Method') }}</th>
            <th>{{ $t('Status') }}</th>
            <th>{{ $t('Date') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="7" class="text-center text-medium-emphasis pa-8">
              {{ $t('No transactions yet.') }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
