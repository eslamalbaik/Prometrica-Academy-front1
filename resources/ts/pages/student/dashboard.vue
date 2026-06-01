<script setup lang="ts">
definePage({
  meta: {
    requiresStudent: true,
  },
})
</script>

<template>
  <div>
    <h4 class="text-h4 mb-2">Welcome Back! 👋</h4>
    <p class="text-body-1 text-medium-emphasis mb-6">Continue your pharmacy learning journey</p>

    <VRow>
      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar color="primary" variant="tonal" size="48" rounded>
              <VIcon icon="tabler-book" size="28" />
            </VAvatar>
            <div>
              <span class="text-body-2 text-medium-emphasis">My Courses</span>
              <h4 class="text-h4">0</h4>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar color="success" variant="tonal" size="48" rounded>
              <VIcon icon="tabler-certificate" size="28" />
            </VAvatar>
            <div>
              <span class="text-body-2 text-medium-emphasis">Certificates</span>
              <h4 class="text-h4">0</h4>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar color="info" variant="tonal" size="48" rounded>
              <VIcon icon="tabler-clock" size="28" />
            </VAvatar>
            <div>
              <span class="text-body-2 text-medium-emphasis">Watch Time</span>
              <h4 class="text-h4">0h</h4>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" lg="3">
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar color="warning" variant="tonal" size="48" rounded>
              <VIcon icon="tabler-chart-pie" size="28" />
            </VAvatar>
            <div>
              <span class="text-body-2 text-medium-emphasis">Avg Score</span>
              <h4 class="text-h4">—</h4>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mt-2">
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VCardTitle>Continue Learning</VCardTitle>
          </VCardItem>
          <VCardText>
            <div class="text-center text-medium-emphasis pa-8">
              <VIcon icon="tabler-books" size="48" class="mb-4 text-disabled" />
              <p>You haven't enrolled in any courses yet.</p>
              <VBtn color="primary" class="mt-2">
                Browse Courses
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
