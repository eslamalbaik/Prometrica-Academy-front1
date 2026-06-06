<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

// ─── Table State ────────────────────────────────────────────────────────────
const students  = ref<any[]>([])
const isLoading = ref(true)

// ─── View Profile Dialog ────────────────────────────────────────────────────
const selectedStudent      = ref<any>(null)
const isProfileDialogVisible = ref(false)
const viewStudent = (s: any) => { selectedStudent.value = s; isProfileDialogVisible.value = true }

// ─── Add Student Dialog State ───────────────────────────────────────────────
const isAddDialogVisible = ref(false)
const isAdding           = ref(false)
const addErrors          = ref<Record<string, string>>({})  // 422 field errors
const isPasswordVisible  = ref(false)
const addForm = ref({ name: '', email: '', password: '' })

const openAddDialog = () => {
  addForm.value   = { name: '', email: '', password: '' }
  addErrors.value = {}
  isPasswordVisible.value = false
  isAddDialogVisible.value = true
}

const submitAddStudent = async () => {
  addErrors.value = {}
  isAdding.value  = true
  try {
    const res = await api.post('/api/dashboard/students', addForm.value)
    students.value.unshift(res.data.student)   // Prepend to list without refetch
    isAddDialogVisible.value = false
  } catch (e: any) {
    if (e.response?.status === 422) {
      // Hydrate each field with its first error message from Laravel
      const raw = e.response.data.errors || {}
      Object.keys(raw).forEach(k => { addErrors.value[k] = raw[k][0] })
    } else {
      addErrors.value['email'] = 'Something went wrong. Please try again.'
    }
  } finally {
    isAdding.value = false
  }
}

// ─── Fetch Students ─────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await api.get('/api/dashboard/students')
    students.value = res.data || []
  } catch (e) {
    console.error('Failed to fetch students', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-users" />
        {{ $t('Students') }}
        <VChip size="small" color="primary" class="ms-2">{{ students.length }}</VChip>
      </VCardTitle>
      <VCardSubtitle>{{ $t('Manage all registered students') }}</VCardSubtitle>

      <template #append>
        <VBtn color="primary" prepend-icon="tabler-user-plus" @click="openAddDialog">
          {{ $t('Add Student') }}
        </VBtn>
      </template>
    </VCardItem>

    <VCardText>
      <VTable>
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Email') }}</th>
            <th>{{ $t('Role') }}</th>
            <th>{{ $t('Registered') }}</th>
            <th>{{ $t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="text-center pa-8">
              <VProgressCircular indeterminate color="primary" />
            </td>
          </tr>
          <tr v-else-if="students.length === 0">
            <td colspan="5" class="text-center text-medium-emphasis pa-8">
              {{ $t('No students registered yet.') }}
            </td>
          </tr>
          <tr v-for="student in students" :key="student.id">
            <td>
              <div class="d-flex align-center gap-2">
                <VAvatar color="primary" variant="tonal" size="34">
                  <VIcon icon="tabler-user" size="18" />
                </VAvatar>
                <span class="font-weight-medium">{{ student.name }}</span>
              </div>
            </td>
            <td class="text-medium-emphasis">{{ student.email }}</td>
            <td>
              <VChip color="primary" size="small" label>{{ student.role }}</VChip>
            </td>
            <td class="text-caption text-medium-emphasis">
              {{ new Date(student.created_at).toLocaleDateString() }}
            </td>
            <td>
              <VBtn icon="tabler-eye" variant="text" size="small" @click="viewStudent(student)" />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- ─── Profile View Dialog ──────────────────────────────────────────────── -->
  <VDialog v-model="isProfileDialogVisible" max-width="480">
    <VCard v-if="selectedStudent">
      <VCardItem>
        <VCardTitle class="d-flex align-center gap-2">
          <VIcon icon="tabler-user-circle" />
          {{ $t('Student Profile') }}
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <VList>
          <VListItem prepend-icon="tabler-hash">
            <VListItemTitle>{{ $t('ID') }}</VListItemTitle>
            <VListItemSubtitle>{{ selectedStudent.id }}</VListItemSubtitle>
          </VListItem>
          <VListItem prepend-icon="tabler-user">
            <VListItemTitle>{{ $t('Name') }}</VListItemTitle>
            <VListItemSubtitle>{{ selectedStudent.name }}</VListItemSubtitle>
          </VListItem>
          <VListItem prepend-icon="tabler-mail">
            <VListItemTitle>{{ $t('Email') }}</VListItemTitle>
            <VListItemSubtitle>{{ selectedStudent.email }}</VListItemSubtitle>
          </VListItem>
          <VListItem prepend-icon="tabler-calendar">
            <VListItemTitle>{{ $t('Registered') }}</VListItemTitle>
            <VListItemSubtitle>{{ new Date(selectedStudent.created_at).toLocaleString() }}</VListItemSubtitle>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="outlined" @click="isProfileDialogVisible = false">{{ $t('Close') }}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- ─── Add Student Dialog ───────────────────────────────────────────────── -->
  <VDialog v-model="isAddDialogVisible" max-width="480" persistent>
    <VCard>
      <VCardItem>
        <VCardTitle class="d-flex align-center gap-2">
          <VIcon icon="tabler-user-plus" color="primary" />
          {{ $t('Add New Student') }}
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <VTextField
          v-model="addForm.name"
          :label="$t('Full Name')"
          prepend-inner-icon="tabler-user"
          variant="outlined"
          class="mb-3"
          :error-messages="addErrors['name']"
          autofocus
        />

        <VTextField
          v-model="addForm.email"
          :label="$t('Email Address')"
          type="email"
          prepend-inner-icon="tabler-mail"
          variant="outlined"
          class="mb-3"
          :error-messages="addErrors['email']"
        />

        <VTextField
          v-model="addForm.password"
          :label="$t('Password')"
          :type="isPasswordVisible ? 'text' : 'password'"
          prepend-inner-icon="tabler-lock"
          :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
          variant="outlined"
          :error-messages="addErrors['password']"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <VAlert type="info" variant="tonal" class="mt-3" density="compact">
          {{ $t('Student role is assigned automatically.') }}
        </VAlert>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" :disabled="isAdding" @click="isAddDialogVisible = false">
          {{ $t('Cancel') }}
        </VBtn>
        <VBtn
          color="primary"
          :loading="isAdding"
          :disabled="!addForm.name || !addForm.email || !addForm.password || isAdding"
          @click="submitAddStudent"
        >
          {{ $t('Create Student') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
