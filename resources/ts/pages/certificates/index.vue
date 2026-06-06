<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

const activeTab = ref(0)

// ─── Issued Certificates ──────────────────────────────────────────────────────
const { data: issuedData, isLoading: isLoadingIssued } = useQuery({
  queryKey: ['admin-certificates'],
  queryFn: async () => {
    const res = await api.get('/api/dashboard/certificates')
    return res.data
  },
})

const certificates = computed(() => issuedData.value?.data || [])
const pagination   = computed(() => ({
  current: issuedData.value?.current_page || 1,
  last:    issuedData.value?.last_page    || 1,
  total:   issuedData.value?.total        || 0,
}))

// ─── Stats (per-course) ───────────────────────────────────────────────────────
const { data: statsData, isLoading: isLoadingStats } = useQuery({
  queryKey: ['admin-certificates-stats'],
  queryFn: async () => {
    const res = await api.get('/api/dashboard/certificates/stats')
    return res.data
  },
})

const courseStats = computed(() => statsData.value || [])

// ─── Verify Dialog ────────────────────────────────────────────────────────────
const isVerifyOpen   = ref(false)
const verifyUuid     = ref('')
const isVerifying    = ref(false)
const verifyResult   = ref<any>(null)
const verifyError    = ref('')

const openVerify = (uuid: string) => {
  verifyUuid.value    = uuid
  verifyResult.value  = null
  verifyError.value   = ''
  isVerifyOpen.value  = true
}

const doVerify = async () => {
  isVerifying.value  = true
  verifyResult.value = null
  verifyError.value  = ''
  try {
    const res = await api.get(`/api/certificates/${verifyUuid.value}/verify`)
    verifyResult.value = res.data
  } catch (e: any) {
    verifyError.value = e.response?.data?.message || 'Certificate not found.'
  } finally {
    isVerifying.value = false
  }
}

const thumbnailUrl = (path: string | null) =>
  path ? `http://localhost:8000/storage/${path}` : null
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-certificate" />
        {{ $t('Certificates') }}
        <VChip size="small" color="primary" class="ms-2">{{ pagination.total }}</VChip>
      </VCardTitle>
      <VCardSubtitle>{{ $t('Issued certificates and per-course stats') }}</VCardSubtitle>
    </VCardItem>

    <!-- Tabs -->
    <VCardText class="pb-0">
      <VTabs v-model="activeTab">
        <VTab>{{ $t('Issued Certificates') }}</VTab>
        <VTab>{{ $t('By Course') }}</VTab>
      </VTabs>
    </VCardText>

    <VDivider />

    <!-- ─── Tab 0: Issued Certificates ────────────────────────────────────── -->
    <VCardText v-if="activeTab === 0">
      <div v-if="isLoadingIssued" class="d-flex justify-center pa-8">
        <VProgressCircular indeterminate color="primary" />
      </div>

      <VTable v-else class="border rounded">
        <thead>
          <tr>
            <th>{{ $t('Student') }}</th>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Category') }}</th>
            <th>{{ $t('Issued At') }}</th>
            <th class="text-center">{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="certificates.length === 0">
            <td colspan="5" class="text-center text-medium-emphasis pa-8">
              {{ $t('No certificates issued yet.') }}
            </td>
          </tr>
          <tr v-for="cert in certificates" :key="cert.id">
            <!-- Student -->
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar color="primary" variant="tonal" size="34">
                  <VIcon icon="tabler-user" size="18" />
                </VAvatar>
                <div class="d-flex flex-column">
                  <span class="font-weight-medium text-body-2">{{ cert.user?.name }}</span>
                  <span class="text-caption text-medium-emphasis">{{ cert.user?.email }}</span>
                </div>
              </div>
            </td>

            <!-- Course -->
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar rounded size="32" color="secondary" variant="tonal">
                  <VImg v-if="thumbnailUrl(cert.course?.thumbnail)" :src="thumbnailUrl(cert.course?.thumbnail)" cover />
                  <VIcon v-else icon="tabler-book" size="16" />
                </VAvatar>
                <span class="text-body-2 font-weight-medium">{{ cert.course?.title }}</span>
              </div>
            </td>

            <!-- Category -->
            <td>
              <VChip size="small" color="info" variant="tonal">
                {{ cert.course?.category || '—' }}
              </VChip>
            </td>

            <!-- Issued At -->
            <td class="text-caption text-medium-emphasis">
              {{ new Date(cert.issued_at).toLocaleDateString() }}
            </td>

            <!-- Actions -->
            <td class="text-center">
              <VTooltip text="Verify Certificate" location="top">
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    icon="tabler-shield-check"
                    variant="text"
                    size="small"
                    color="success"
                    @click="openVerify(cert.uuid)"
                  />
                </template>
              </VTooltip>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>

    <!-- ─── Tab 1: By Course ───────────────────────────────────────────────── -->
    <VCardText v-else>
      <div v-if="isLoadingStats" class="d-flex justify-center pa-8">
        <VProgressCircular indeterminate color="primary" />
      </div>

      <div v-else-if="courseStats.length === 0" class="text-center text-medium-emphasis pa-8">
        {{ $t('No certificates issued yet.') }}
      </div>

      <VTable v-else class="border rounded">
        <thead>
          <tr>
            <th>{{ $t('Course') }}</th>
            <th>{{ $t('Category') }}</th>
            <th class="text-center">{{ $t('Certificates Issued') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in courseStats" :key="stat.course_id">
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar rounded size="32" color="secondary" variant="tonal">
                  <VImg v-if="thumbnailUrl(stat.course?.thumbnail)" :src="thumbnailUrl(stat.course?.thumbnail)" cover />
                  <VIcon v-else icon="tabler-book" size="16" />
                </VAvatar>
                <span class="font-weight-medium">{{ stat.course?.title }}</span>
              </div>
            </td>
            <td>
              <VChip size="small" color="info" variant="tonal">{{ stat.course?.category || '—' }}</VChip>
            </td>
            <td class="text-center">
              <VChip size="small" color="success" variant="tonal">
                <VIcon icon="tabler-certificate" size="13" class="me-1" />
                {{ stat.issued_count }}
              </VChip>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- ─── Verify Dialog ──────────────────────────────────────────────────────── -->
  <VDialog v-model="isVerifyOpen" max-width="480">
    <VCard>
      <VCardItem>
        <VCardTitle class="d-flex align-center gap-2">
          <VIcon icon="tabler-shield-check" color="success" />
          {{ $t('Verify Certificate') }}
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <VTextField
          v-model="verifyUuid"
          :label="$t('Certificate UUID')"
          variant="outlined"
          density="compact"
          class="mb-4"
          readonly
        />

        <!-- Result -->
        <VAlert v-if="verifyResult" type="success" variant="tonal" class="mb-2">
          <div class="font-weight-bold mb-1">✅ {{ $t('Valid Certificate') }}</div>
          <div class="text-body-2">{{ $t('Student') }}: <strong>{{ verifyResult.student }}</strong></div>
          <div class="text-body-2">{{ $t('Course') }}: <strong>{{ verifyResult.course }}</strong></div>
          <div class="text-body-2">{{ $t('Issued') }}: <strong>{{ verifyResult.issued_at }}</strong></div>
        </VAlert>

        <VAlert v-if="verifyError" type="error" variant="tonal">
          {{ verifyError }}
        </VAlert>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="isVerifyOpen = false">{{ $t('Close') }}</VBtn>
        <VBtn color="success" :loading="isVerifying" @click="doVerify">
          {{ $t('Verify') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
