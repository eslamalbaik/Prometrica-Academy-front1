<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

const queryClient = useQueryClient()

// ─── Data ─────────────────────────────────────────────────────────────────────
const { data: bundlesData, isLoading } = useQuery({
  queryKey: ['bundles'],
  queryFn: async () => (await api.get('/api/dashboard/bundles')).data,
})
const bundles = computed(() => bundlesData.value ?? [])

const { data: coursesData } = useQuery({
  queryKey: ['courses-list'],
  queryFn: async () => (await api.get('/api/dashboard/courses')).data,
})
const allCourses = computed(() =>
  (coursesData.value?.data ?? coursesData.value ?? []).map((c: any) => ({
    title: c.title || c.name || `Course ${c.id}`,
    value: c.id,
  }))
)

// ─── Form ─────────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '',
  name_en: '',
  description: '',
  description_en: '',
  price: 0,
  is_active: true,
  sort: 0,
  access_days: null as number | null,
  course_ids: [] as number[],
})

const isFormOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const form = ref<any>(emptyForm())
const formError = ref('')

const openCreate = () => {
  isEditing.value = false
  editingId.value = null
  form.value = emptyForm()
  form.value.sort = bundles.value.length
  formError.value = ''
  isFormOpen.value = true
}

const openEdit = (b: any) => {
  isEditing.value = true
  editingId.value = b.id
  form.value = {
    ...emptyForm(),
    name: b.name,
    name_en: b.name_en ?? '',
    description: b.description ?? '',
    description_en: b.description_en ?? '',
    price: Number(b.price),
    is_active: b.is_active,
    sort: b.sort ?? 0,
    access_days: b.access_days ?? null,
    course_ids: (b.courses ?? []).map((c: any) => c.id),
  }
  formError.value = ''
  isFormOpen.value = true
}

// ─── Save ─────────────────────────────────────────────────────────────────────
const saveMutation = useMutation({
  mutationFn: async () => {
    const payload = { ...form.value }
    if (isEditing.value)
      return (await api.put(`/api/dashboard/bundles/${editingId.value}`, payload)).data
    return (await api.post('/api/dashboard/bundles', payload)).data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bundles'] })
    isFormOpen.value = false
  },
  onError: (e: any) => {
    formError.value = e?.response?.data?.message || 'Failed to save bundle.'
  },
})

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteMutation = useMutation({
  mutationFn: async (id: number) => (await api.delete(`/api/dashboard/bundles/${id}`)).data,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bundles'] }),
})
const confirmDelete = (b: any) => {
  if (confirm(`Delete the "${b.name}" bundle?`))
    deleteMutation.mutate(b.id)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold">{{ $t('Bundles') }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Multi-course packages for students') }}</p>
      </div>
      <VBtn color="primary" prepend-icon="tabler-plus" @click="openCreate">{{ $t('New Bundle') }}</VBtn>
    </div>

    <!-- Loading -->
    <VProgressLinear v-if="isLoading" indeterminate color="primary" />

    <!-- Empty -->
    <VCard v-else-if="bundles.length === 0" class="text-center py-12">
      <VIcon icon="tabler-packages" size="64" color="disabled" class="mb-3" />
      <p class="text-h6 text-medium-emphasis">{{ $t('No bundles yet.') }}</p>
    </VCard>

    <!-- List -->
    <VRow v-else>
      <VCol v-for="b in bundles" :key="b.id" cols="12" md="6" lg="4">
        <VCard variant="outlined">
          <VCardItem>
            <VCardTitle class="d-flex align-center justify-space-between">
              <span>{{ b.name }}</span>
              <VChip
                size="small"
                :color="b.is_active ? 'success' : 'secondary'"
              >
                {{ b.is_active ? $t('Active') : $t('Hidden') }}
              </VChip>
            </VCardTitle>
            <VCardSubtitle v-if="b.name_en">{{ b.name_en }}</VCardSubtitle>
          </VCardItem>

          <VCardText>
            <div class="d-flex align-center gap-4 text-body-2 text-medium-emphasis mb-2">
              <span>
                <VIcon icon="tabler-currency-dollar" size="16" />
                {{ Number(b.price).toLocaleString() }} ريال
              </span>
              <span>
                <VIcon icon="tabler-book-2" size="16" />
                {{ (b.courses ?? []).length }} {{ $t('courses') }}
              </span>
              <span v-if="b.access_days">
                <VIcon icon="tabler-clock" size="16" />
                {{ b.access_days }} {{ $t('days') }}
              </span>
              <span v-else>
                <VIcon icon="tabler-infinity" size="16" />
                {{ $t('Lifetime') }}
              </span>
            </div>
            <p v-if="b.description" class="text-body-2 mb-0 text-truncate">{{ b.description }}</p>
          </VCardText>

          <VDivider />
          <VCardActions>
            <VBtn size="small" prepend-icon="tabler-edit" @click="openEdit(b)">{{ $t('Edit') }}</VBtn>
            <VSpacer />
            <IconBtn color="error" @click="confirmDelete(b)"><VIcon icon="tabler-trash" /></IconBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <!-- Create / Edit dialog -->
    <VDialog v-model="isFormOpen" max-width="700" scrollable persistent>
      <VCard>
        <VCardTitle class="pt-4">{{ isEditing ? $t('Edit Bundle') : $t('New Bundle') }}</VCardTitle>
        <VCardText style="max-height: 72vh;">
          <VAlert v-if="formError" type="error" variant="tonal" class="mb-4">{{ formError }}</VAlert>

          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="form.name" :label="$t('Name (Arabic)')" :rules="[v => !!v || 'Required']" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="form.name_en" :label="$t('Name (English)')" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextarea v-model="form.description" :label="$t('Description (Arabic)')" rows="2" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextarea v-model="form.description_en" :label="$t('Description (English)')" rows="2" />
            </VCol>
            <VCol cols="6" md="3">
              <VTextField
                v-model.number="form.price"
                :label="$t('Price (SAR)')"
                type="number"
                min="0"
              />
            </VCol>
            <VCol cols="6" md="3">
              <VTextField
                v-model.number="form.access_days"
                :label="$t('Access Days')"
                type="number"
                min="1"
                :placeholder="$t('Leave empty for lifetime')"
              />
            </VCol>
            <VCol cols="6" md="3">
              <VTextField v-model.number="form.sort" :label="$t('Sort')" type="number" min="0" />
            </VCol>
            <VCol cols="6" md="3" class="d-flex align-center">
              <VSwitch v-model="form.is_active" :label="$t('Active')" color="success" hide-details />
            </VCol>

            <!-- Courses selection -->
            <VCol cols="12">
              <VSelect
                v-model="form.course_ids"
                :items="allCourses"
                item-title="title"
                item-value="value"
                :return-object="false"
                :label="$t('Select Courses')"
                multiple
                chips
                closable-chips
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isFormOpen = false">{{ $t('Cancel') }}</VBtn>
          <VBtn
            color="primary"
            :loading="saveMutation.isPending.value"
            :disabled="!form.name || form.price === null"
            @click="saveMutation.mutate()"
          >
            {{ $t('Save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
