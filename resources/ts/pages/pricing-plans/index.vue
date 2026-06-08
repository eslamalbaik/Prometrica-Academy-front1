<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

const queryClient = useQueryClient()

const { data: plansData, isLoading } = useQuery({
  queryKey: ['pricing-plans'],
  queryFn: async () => (await api.get('/api/dashboard/pricing-plans')).data,
})
const plans = computed(() => plansData.value ?? [])

// ─── Form ─────────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '', name_en: '', description: '', description_en: '',
  price: 0, period: '', period_en: '',
  badge: '', badge_en: '', is_featured: false, is_active: true,
  cta_label: '', cta_label_en: '', cta_url: '/register', sort: 0,
  color: '#4F46E5',
  features: [] as any[],
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
  formError.value = ''
  isFormOpen.value = true
}
const openEdit = (p: any) => {
  isEditing.value = true
  editingId.value = p.id
  form.value = {
    ...emptyForm(),
    ...p,
    price: Number(p.price),
    features: Array.isArray(p.features) ? JSON.parse(JSON.stringify(p.features)) : [],
  }
  formError.value = ''
  isFormOpen.value = true
}

// Feature-group editing
const addGroup = () => form.value.features.push({ title: '', title_en: '', items: [] })
const removeGroup = (gi: number) => form.value.features.splice(gi, 1)
const addItem = (gi: number) => form.value.features[gi].items.push({ text: '', text_en: '', included: true })
const removeItem = (gi: number, ii: number) => form.value.features[gi].items.splice(ii, 1)

const saveMutation = useMutation({
  mutationFn: async () => {
    if (isEditing.value)
      return (await api.put(`/api/dashboard/pricing-plans/${editingId.value}`, form.value)).data
    return (await api.post('/api/dashboard/pricing-plans', form.value)).data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['pricing-plans'] })
    isFormOpen.value = false
  },
  onError: (e: any) => { formError.value = e?.response?.data?.message || 'Failed to save plan.' },
})

const deleteMutation = useMutation({
  mutationFn: async (id: number) => (await api.delete(`/api/dashboard/pricing-plans/${id}`)).data,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pricing-plans'] }),
})
const confirmDelete = (p: any) => {
  if (confirm(`Delete the "${p.name}" plan?`))
    deleteMutation.mutate(p.id)
}

const featureCount = (p: any) =>
  (p.features || []).reduce((sum: number, g: any) => sum + (g.items?.length || 0), 0)
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold">{{ $t('Pricing Plans') }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('Landing-page packages shown to visitors') }}</p>
      </div>
      <VBtn color="primary" prepend-icon="tabler-plus" @click="openCreate">{{ $t('New Plan') }}</VBtn>
    </div>

    <VRow v-if="isLoading">
      <VCol v-for="i in 3" :key="i" cols="12" md="4"><VSkeletonLoader type="article" /></VCol>
    </VRow>

    <VCard v-else-if="plans.length === 0" class="text-center py-12">
      <VIcon icon="tabler-layout-grid" size="64" color="disabled" class="mb-3" />
      <p class="text-h6 text-medium-emphasis">{{ $t('No pricing plans yet.') }}</p>
    </VCard>

    <VRow v-else>
      <VCol v-for="p in plans" :key="p.id" cols="12" md="4">
        <VCard :color="p.is_featured ? 'primary' : undefined" :variant="p.is_featured ? 'flat' : 'outlined'">
          <VCardItem>
            <VCardTitle class="d-flex align-center justify-space-between">
              <span>{{ p.name }}</span>
              <VChip v-if="p.badge" size="small" :color="p.is_featured ? 'amber' : 'primary'">{{ p.badge }}</VChip>
            </VCardTitle>
            <VCardSubtitle>
              {{ Number(p.price) === 0 ? $t('Free') : Number(p.price).toLocaleString() + ' · ' + (p.period || '') }}
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div class="d-flex align-center gap-3 text-body-2" :class="p.is_featured ? '' : 'text-medium-emphasis'">
              <span><VIcon icon="tabler-list-check" size="16" /> {{ featureCount(p) }} {{ $t('features') }}</span>
              <span><VIcon :icon="p.is_active ? 'tabler-eye' : 'tabler-eye-off'" size="16" /> {{ p.is_active ? $t('Active') : $t('Hidden') }}</span>
            </div>
          </VCardText>
          <VDivider />
          <VCardActions>
            <VBtn size="small" prepend-icon="tabler-edit" :color="p.is_featured ? 'white' : undefined" @click="openEdit(p)">{{ $t('Edit') }}</VBtn>
            <VSpacer />
            <IconBtn :color="p.is_featured ? 'white' : 'error'" @click="confirmDelete(p)"><VIcon icon="tabler-trash" /></IconBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <!-- Create / Edit dialog -->
    <VDialog v-model="isFormOpen" max-width="760" scrollable persistent>
      <VCard>
        <VCardTitle class="pt-4">{{ isEditing ? $t('Edit Plan') : $t('New Plan') }}</VCardTitle>
        <VCardText style="max-height: 72vh;">
          <VAlert v-if="formError" type="error" variant="tonal" class="mb-4">{{ formError }}</VAlert>

          <VRow>
            <VCol cols="12" md="6"><VTextField v-model="form.name" :label="$t('Name (Arabic)')" /></VCol>
            <VCol cols="12" md="6"><VTextField v-model="form.name_en" :label="$t('Name (English)')" /></VCol>
            <VCol cols="12" md="6"><VTextarea v-model="form.description" :label="$t('Description (Arabic)')" rows="2" /></VCol>
            <VCol cols="12" md="6"><VTextarea v-model="form.description_en" :label="$t('Description (English)')" rows="2" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model.number="form.price" :label="$t('Price')" type="number" min="0" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.period" :label="$t('Period (AR)')" placeholder="ريال / سنوياً" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.period_en" :label="$t('Period (EN)')" placeholder="SAR / yearly" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model.number="form.sort" :label="$t('Sort')" type="number" min="0" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.badge" :label="$t('Badge (AR)')" placeholder="الأكثر شيوعاً" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.badge_en" :label="$t('Badge (EN)')" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.cta_label" :label="$t('Button (AR)')" placeholder="اشترك الآن" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.cta_url" :label="$t('Button URL')" placeholder="/register" /></VCol>
            <VCol cols="6" md="3"><VTextField v-model="form.color" :label="$t('Color')" type="color" /></VCol>
            <VCol cols="6" md="3"><VSwitch v-model="form.is_featured" :label="$t('Featured (highlighted)')" color="primary" /></VCol>
            <VCol cols="6" md="3"><VSwitch v-model="form.is_active" :label="$t('Active (visible)')" color="success" /></VCol>
          </VRow>

          <!-- Feature groups editor -->
          <VDivider class="my-4" />
          <div class="d-flex align-center justify-space-between mb-3">
            <h6 class="text-h6">{{ $t('Feature Groups') }}</h6>
            <VBtn size="small" variant="tonal" prepend-icon="tabler-plus" @click="addGroup">{{ $t('Add Group') }}</VBtn>
          </div>

          <VCard v-for="(group, gi) in form.features" :key="gi" variant="outlined" class="mb-3">
            <VCardText>
              <div class="d-flex gap-2 mb-2">
                <VTextField v-model="group.title" :label="$t('Group title (AR)')" density="compact" hide-details />
                <VTextField v-model="group.title_en" :label="$t('Group title (EN)')" density="compact" hide-details />
                <IconBtn color="error" @click="removeGroup(gi)"><VIcon icon="tabler-trash" /></IconBtn>
              </div>
              <div v-for="(item, ii) in group.items" :key="ii" class="d-flex align-center gap-2 mb-2">
                <VTextField v-model="item.text" :label="$t('Feature (AR)')" density="compact" hide-details />
                <VTextField v-model="item.text_en" :label="$t('Feature (EN)')" density="compact" hide-details />
                <VSwitch v-model="item.included" color="success" density="compact" hide-details :true-value="true" :false-value="false" />
                <IconBtn size="small" color="error" @click="removeItem(gi, ii)"><VIcon icon="tabler-x" /></IconBtn>
              </div>
              <VBtn size="x-small" variant="text" prepend-icon="tabler-plus" @click="addItem(gi)">{{ $t('Add feature') }}</VBtn>
            </VCardText>
          </VCard>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isFormOpen = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="primary" :loading="saveMutation.isPending.value" :disabled="!form.name" @click="saveMutation.mutate()">{{ $t('Save') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
