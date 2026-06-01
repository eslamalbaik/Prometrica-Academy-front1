<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })
</script>

<template>
  <div>
    <VRow>
      <!-- Revenue Reports -->
      <VCol cols="12" lg="8">
        <VCard class="mb-6">
          <VCardItem>
            <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-chart-pie" />
            {{ $t('Analytics') }}
          </VCardTitle>
          <VCardSubtitle>{{ $t('Track revenue performance') }}</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <VAlert type="info" variant="tonal">
              Analytics charts will be populated with real data from the API.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Quick Stats -->
      <VCol cols="12" lg="4">
        <VCard class="mb-6">
          <VCardItem>
            <VCardTitle>Quick Stats</VCardTitle>
          </VCardItem>
          <VCardText>
            <div class="d-flex flex-column gap-4">
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Active Students</span>
                <span class="font-weight-semibold">—</span>
              </div>
              <VDivider />
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Retention Rate</span>
                <span class="font-weight-semibold">—</span>
              </div>
              <VDivider />
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Avg Watch Time</span>
                <span class="font-weight-semibold">—</span>
              </div>
              <VDivider />
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Avg Quiz Score</span>
                <span class="font-weight-semibold">—</span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
