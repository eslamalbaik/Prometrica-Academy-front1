<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

const route    = useRoute()
const courseId = route.params.id

// ─── Data ────────────────────────────────────────────────────────────────────
const modules   = ref<any[]>([])
const isLoading = ref(true)

const fetchCurriculum = async () => {
  try {
    const res = await api.get(`/api/dashboard/courses/${courseId}?include=modules.lessons,modules.quizzes`)
    modules.value = res.data.course?.modules || []
    
    // Sort items for UI
    modules.value.forEach(mod => {
      const lessons = mod.lessons?.map((l: any) => ({ ...l, item_type: 'lesson' })) || []
      const quizzes = mod.quizzes?.map((q: any) => ({ ...q, item_type: 'quiz' })) || []
      mod.items = [...lessons, ...quizzes].sort((a, b) => a.order - b.order)
    })
  } catch (e) {
    console.error('Failed to load curriculum', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCurriculum)

// ─── Add Module Dialog ────────────────────────────────────────────────────────
const isAddModuleVisible = ref(false)
const isAddingModule     = ref(false)
const addModuleTitle     = ref('')

const submitAddModule = async () => {
  if (!addModuleTitle.value.trim()) return
  isAddingModule.value = true
  try {
    await api.post('/api/dashboard/modules', { course_id: courseId, title: addModuleTitle.value })
    addModuleTitle.value = ''
    isAddModuleVisible.value = false
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isAddingModule.value = false }
}

// ─── Edit Module Dialog ───────────────────────────────────────────────────────
const isEditModuleVisible = ref(false)
const isEditingModule     = ref(false)
const editModuleData      = ref<{ id: number; title: string }>({ id: 0, title: '' })

const openEditModule = (mod: any) => {
  editModuleData.value = { id: mod.id, title: mod.title }
  isEditModuleVisible.value = true
}

const submitEditModule = async () => {
  if (!editModuleData.value.title.trim()) return
  isEditingModule.value = true
  try {
    await api.put(`/api/dashboard/modules/${editModuleData.value.id}`, { title: editModuleData.value.title })
    isEditModuleVisible.value = false
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isEditingModule.value = false }
}

// ─── Delete Module ────────────────────────────────────────────────────────────
const moduleToDelete        = ref<any>(null)
const isDeleteModuleVisible = ref(false)
const isDeletingModule      = ref(false)

const confirmDeleteModule = (mod: any) => { moduleToDelete.value = mod; isDeleteModuleVisible.value = true }

const executeDeleteModule = async () => {
  isDeletingModule.value = true
  try {
    await api.delete(`/api/dashboard/modules/${moduleToDelete.value.id}`)
    isDeleteModuleVisible.value = false
    moduleToDelete.value = null
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isDeletingModule.value = false }
}

// ─── Add Lesson Dialog ────────────────────────────────────────────────────────
const isAddLessonVisible = ref(false)
const isAddingLesson     = ref(false)
const activeLessonModuleId = ref<number | null>(null)
const addLessonForm = ref({ title: '', video_url: '', content: '' })

const openAddLesson = (moduleId: number) => {
  activeLessonModuleId.value = moduleId
  addLessonForm.value = { title: '', video_url: '', content: '' }
  isAddLessonVisible.value = true
}

const submitAddLesson = async () => {
  isAddingLesson.value = true
  try {
    await api.post('/api/dashboard/lessons', {
      module_id: activeLessonModuleId.value,
      ...addLessonForm.value,
    })
    isAddLessonVisible.value = false
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isAddingLesson.value = false }
}

// ─── Edit Lesson Dialog ───────────────────────────────────────────────────────
const isEditLessonVisible = ref(false)
const isEditingLesson     = ref(false)
const editLessonData = ref<{ id: number; title: string; video_url: string; content: string }>({
  id: 0, title: '', video_url: '', content: ''
})

const openEditLesson = (lesson: any) => {
  editLessonData.value = {
    id:        lesson.id,
    title:     lesson.title,
    video_url: lesson.video_url || '',
    content:   lesson.content  || '',
  }
  isEditLessonVisible.value = true
}

const submitEditLesson = async () => {
  isEditingLesson.value = true
  try {
    await api.put(`/api/dashboard/lessons/${editLessonData.value.id}`, {
      title:     editLessonData.value.title,
      video_url: editLessonData.value.video_url,
      content:   editLessonData.value.content,
    })
    isEditLessonVisible.value = false
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isEditingLesson.value = false }
}

// ─── Delete Lesson ────────────────────────────────────────────────────────────
const lessonToDelete        = ref<any>(null)
const isDeleteLessonVisible = ref(false)
const isDeletingLesson      = ref(false)

const confirmDeleteLesson = (lesson: any) => { lessonToDelete.value = lesson; isDeleteLessonVisible.value = true }

const executeDeleteLesson = async () => {
  isDeletingLesson.value = true
  try {
    await api.delete(`/api/dashboard/lessons/${lessonToDelete.value.id}`)
    isDeleteLessonVisible.value = false
    lessonToDelete.value = null
    await fetchCurriculum()
  } catch (e) { console.error(e) }
  finally { isDeletingLesson.value = false }
}
</script>

<template>
  <VCard class="pa-5">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h4 class="text-h5 font-weight-bold">{{ $t('Curriculum Builder') }}</h4>
        <p class="text-medium-emphasis text-body-2 mt-1">{{ $t('Manage course modules and lessons') }}</p>
      </div>
      <VBtn prepend-icon="tabler-plus" color="primary" @click="isAddModuleVisible = true">
        {{ $t('Add Module') }}
      </VBtn>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="d-flex justify-center pa-8">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <!-- Empty State -->
    <VAlert v-else-if="modules.length === 0" color="info" variant="tonal" prepend-icon="tabler-info-circle">
      {{ $t('No modules yet. Click "Add Module" to get started.') }}
    </VAlert>

    <!-- Modules Accordion -->
    <VExpansionPanels v-else class="mt-2" variant="accordion">
      <VExpansionPanel v-for="(mod, mIdx) in modules" :key="mod.id">
        <VExpansionPanelTitle>
          <div class="d-flex align-center gap-3 w-100">
            <VChip size="x-small" color="primary" variant="tonal" label>{{ mIdx + 1 }}</VChip>
            <span class="font-weight-semibold text-h6">{{ mod.title }}</span>
            <VChip size="x-small" variant="tonal" color="secondary" class="ms-auto me-4">
              {{ mod.lessons?.length || 0 }} {{ $t('lessons') }}
            </VChip>
          </div>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
          <!-- Module Actions Bar -->
          <div class="d-flex gap-2 mb-4">
            <VBtn
              size="small"
              variant="tonal"
              color="info"
              prepend-icon="tabler-edit"
              @click.stop="openEditModule(mod)"
            >
              {{ $t('Rename Module') }}
            </VBtn>
            <VBtn
              size="small"
              variant="tonal"
              color="error"
              prepend-icon="tabler-trash"
              @click.stop="confirmDeleteModule(mod)"
            >
              {{ $t('Delete Module') }}
            </VBtn>
          </div>

          <VDivider class="mb-4" />

          <!-- Items List (Lessons & Quizzes) -->
          <VList v-if="mod.items && mod.items.length > 0" class="mb-3" lines="two">
            <VListItem
              v-for="(item, lIdx) in mod.items"
              :key="`${item.item_type}-${item.id}`"
              :subtitle="item.item_type === 'lesson' ? item.video_url : `${item.questions?.length || 0} Questions • Pass: ${item.passing_score}%`"
              rounded="lg"
              class="mb-1"
              border
            >
              <template #prepend>
                <VAvatar :color="item.item_type === 'quiz' ? 'secondary' : 'primary'" variant="tonal" size="36" rounded>
                  <VIcon :icon="item.item_type === 'quiz' ? 'tabler-clipboard-check' : 'tabler-play-circle'" size="20" />
                </VAvatar>
              </template>

              <template #title>
                <span class="font-weight-medium">{{ item.title }}</span>
                <VChip v-if="item.item_type === 'quiz'" size="x-small" color="secondary" class="ml-2">Quiz</VChip>
              </template>

              <template #subtitle>
                <span class="text-caption text-medium-emphasis">
                  {{ item.item_type === 'lesson' ? item.video_url : `Passing Score: ${item.passing_score}%` }}
                </span>
              </template>

              <template #append>
                <VBtn v-if="item.item_type === 'lesson'" icon="tabler-edit" variant="text" size="small" color="info" @click="openEditLesson(item)" />
                <VBtn v-if="item.item_type === 'lesson'" icon="tabler-trash" variant="text" size="small" color="error" @click="confirmDeleteLesson(item)" />
                <!-- Add quiz edit/delete actions here later -->
              </template>
            </VListItem>
          </VList>

          <p v-else class="text-medium-emphasis text-body-2 mb-3">{{ $t('No items in this module yet.') }}</p>

          <!-- Add Buttons -->
          <div class="d-flex gap-2">
            <VBtn size="small" variant="outlined" color="primary" prepend-icon="tabler-plus" @click="openAddLesson(mod.id)">
              {{ $t('Add Lesson') }}
            </VBtn>
            <!-- A real implementation would have openAddQuiz(mod.id), keeping simple for this iteration -->
            <VBtn size="small" variant="outlined" color="secondary" prepend-icon="tabler-plus" to="/quizzes/exams">
              {{ $t('Manage Quizzes') }}
            </VBtn>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <!-- ─── Add Module Dialog ─────────────────────────────────────────────────── -->
    <VDialog v-model="isAddModuleVisible" max-width="480">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-layout-list" color="primary" />
            {{ $t('Add Module') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <VTextField
            v-model="addModuleTitle"
            :label="$t('Module Title')"
            variant="outlined"
            autofocus
            @keyup.enter="submitAddModule"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isAddModuleVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="primary" :loading="isAddingModule" :disabled="!addModuleTitle.trim()" @click="submitAddModule">
            {{ $t('Save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Edit Module Dialog ────────────────────────────────────────────────── -->
    <VDialog v-model="isEditModuleVisible" max-width="480">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-edit" color="info" />
            {{ $t('Rename Module') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <VTextField
            v-model="editModuleData.title"
            :label="$t('Module Title')"
            variant="outlined"
            autofocus
            @keyup.enter="submitEditModule"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isEditModuleVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="info" :loading="isEditingModule" :disabled="!editModuleData.title.trim()" @click="submitEditModule">
            {{ $t('Save Changes') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Delete Module Confirm ─────────────────────────────────────────────── -->
    <VDialog v-model="isDeleteModuleVisible" max-width="420">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2 text-error">
            <VIcon icon="tabler-alert-triangle" color="error" />
            {{ $t('Delete Module') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <p>{{ $t('Are you sure you want to delete module') }} <strong>{{ moduleToDelete?.title }}</strong>?</p>
          <VAlert type="warning" variant="tonal" density="compact" class="mt-3">
            {{ $t('All lessons inside this module will also be deleted.') }}
          </VAlert>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isDeleteModuleVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="error" :loading="isDeletingModule" @click="executeDeleteModule">
            {{ $t('Yes, Delete') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Add Lesson Dialog ─────────────────────────────────────────────────── -->
    <VDialog v-model="isAddLessonVisible" max-width="560">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-video" color="primary" />
            {{ $t('Add Lesson') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField v-model="addLessonForm.title" :label="$t('Lesson Title')" variant="outlined" autofocus />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="addLessonForm.video_url"
                :label="$t('Video URL')"
                placeholder="https://youtube.com/..."
                type="url"
                variant="outlined"
                prepend-inner-icon="tabler-brand-youtube"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea v-model="addLessonForm.content" :label="$t('Notes (optional)')" variant="outlined" rows="3" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isAddLessonVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn
            color="primary"
            :loading="isAddingLesson"
            :disabled="!addLessonForm.title || !addLessonForm.video_url"
            @click="submitAddLesson"
          >
            {{ $t('Save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Edit Lesson Dialog ────────────────────────────────────────────────── -->
    <VDialog v-model="isEditLessonVisible" max-width="560">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-edit" color="info" />
            {{ $t('Edit Lesson') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField v-model="editLessonData.title" :label="$t('Lesson Title')" variant="outlined" autofocus />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="editLessonData.video_url"
                :label="$t('Video URL')"
                type="url"
                variant="outlined"
                prepend-inner-icon="tabler-brand-youtube"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea v-model="editLessonData.content" :label="$t('Notes (optional)')" variant="outlined" rows="3" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isEditLessonVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn
            color="info"
            :loading="isEditingLesson"
            :disabled="!editLessonData.title || !editLessonData.video_url"
            @click="submitEditLesson"
          >
            {{ $t('Save Changes') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Delete Lesson Confirm ─────────────────────────────────────────────── -->
    <VDialog v-model="isDeleteLessonVisible" max-width="400">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2 text-error">
            <VIcon icon="tabler-trash" color="error" />
            {{ $t('Delete Lesson') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <p>{{ $t('Delete lesson') }} <strong>{{ lessonToDelete?.title }}</strong>?</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isDeleteLessonVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="error" :loading="isDeletingLesson" @click="executeDeleteLesson">
            {{ $t('Yes, Delete') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
