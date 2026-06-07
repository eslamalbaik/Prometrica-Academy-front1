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

// ─── Module Attachments ───────────────────────────────────────────────────────
const attachmentsMap        = ref<Record<number, any[]>>({})
const isUploadVisible       = ref(false)
const isUploading           = ref(false)
const uploadModuleId        = ref<number | null>(null)
const uploadFile            = ref<File | null>(null)
const uploadTitle           = ref('')
const attachmentToDelete    = ref<any>(null)
const isDeleteAttachVisible = ref(false)
const isDeletingAttachment  = ref(false)

const API_STORAGE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : 'http://localhost:8000'

const loadAttachments = async (moduleId: number) => {
  try {
    const res = await api.get(`/api/dashboard/modules/${moduleId}/attachments`)
    attachmentsMap.value[moduleId] = res.data
  } catch (e) { console.error(e) }
}

const openUploadDialog = (moduleId: number) => {
  uploadModuleId.value = moduleId
  uploadFile.value = null
  uploadTitle.value = ''
  isUploadVisible.value = true
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  uploadFile.value = input.files?.[0] ?? null
  if (uploadFile.value && !uploadTitle.value)
    uploadTitle.value = uploadFile.value.name.replace(/\.pdf$/i, '')
}

const submitUpload = async () => {
  if (!uploadFile.value || !uploadModuleId.value) return
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadFile.value)
    formData.append('title', uploadTitle.value || uploadFile.value.name)
    await api.post(`/api/dashboard/modules/${uploadModuleId.value}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    isUploadVisible.value = false
    await loadAttachments(uploadModuleId.value)
  } catch (e) { console.error(e) }
  finally { isUploading.value = false }
}

const confirmDeleteAttachment = (att: any) => {
  attachmentToDelete.value = att
  isDeleteAttachVisible.value = true
}

const executeDeleteAttachment = async () => {
  isDeletingAttachment.value = true
  try {
    await api.delete(`/api/dashboard/attachments/${attachmentToDelete.value.id}`)
    const modId = attachmentToDelete.value.module_id
    isDeleteAttachVisible.value = false
    attachmentToDelete.value = null
    await loadAttachments(modId)
  } catch (e) { console.error(e) }
  finally { isDeletingAttachment.value = false }
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// load attachments when a module panel opens
const onPanelOpen = (moduleId: number) => {
  if (!attachmentsMap.value[moduleId]) loadAttachments(moduleId)
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
    <VExpansionPanels v-else class="mt-2" variant="accordion" @update:model-value="v => { if (v !== undefined) onPanelOpen(modules[v]?.id) }">
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
            <VBtn size="small" variant="outlined" color="secondary" prepend-icon="tabler-plus" to="/quizzes/exams">
              {{ $t('Manage Quizzes') }}
            </VBtn>
          </div>

          <VDivider class="my-4" />

          <!-- ── PDF Attachments Section ───────────────────────────────── -->
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="d-flex align-center gap-2">
              <VIcon icon="tabler-paperclip" size="18" color="warning" />
              <span class="text-body-1 font-weight-semibold">{{ $t('PDF Attachments') }}</span>
              <VChip size="x-small" variant="tonal" color="warning">
                {{ (attachmentsMap[mod.id] || []).length }}
              </VChip>
            </div>
            <VBtn size="small" variant="tonal" color="warning" prepend-icon="tabler-upload" @click="openUploadDialog(mod.id)">
              {{ $t('Upload PDF') }}
            </VBtn>
          </div>

          <!-- Attachments list -->
          <div v-if="attachmentsMap[mod.id] && attachmentsMap[mod.id].length > 0">
            <VList lines="one" density="compact">
              <VListItem
                v-for="att in attachmentsMap[mod.id]"
                :key="att.id"
                rounded="lg"
                class="mb-1 px-3"
                border
              >
                <template #prepend>
                  <VAvatar color="error" variant="tonal" size="32" rounded>
                    <VIcon icon="tabler-file-type-pdf" size="18" />
                  </VAvatar>
                </template>
                <template #title>
                  <span class="text-body-2 font-weight-medium">{{ att.title }}</span>
                </template>
                <template #subtitle>
                  <span class="text-caption text-medium-emphasis">{{ formatSize(att.file_size) }}</span>
                </template>
                <template #append>
                  <VBtn
                    icon="tabler-download"
                    variant="text"
                    size="small"
                    color="primary"
                    :href="`${API_STORAGE}/storage/${att.file_path}`"
                    target="_blank"
                  />
                  <VBtn
                    icon="tabler-trash"
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDeleteAttachment({ ...att, module_id: mod.id })"
                  />
                </template>
              </VListItem>
            </VList>
          </div>
          <p v-else class="text-caption text-medium-emphasis mb-1">{{ $t('No attachments yet.') }}</p>

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

    <!-- ─── Upload PDF Dialog ────────────────────────────────────────────────── -->
    <VDialog v-model="isUploadVisible" max-width="500">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2">
            <VIcon icon="tabler-file-type-pdf" color="error" />
            {{ $t('Upload PDF Attachment') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="uploadTitle"
                :label="$t('Title (optional)')"
                variant="outlined"
                :placeholder="$t('Leave blank to use filename')"
              />
            </VCol>
            <VCol cols="12">
              <div
                class="rounded-lg border-2 border-dashed pa-6 text-center cursor-pointer"
                style="border-color: rgba(var(--v-theme-warning), 0.5); background: rgba(var(--v-theme-warning), 0.04);"
                @click="($refs.pdfInput as HTMLInputElement).click()"
              >
                <VIcon icon="tabler-upload" size="36" color="warning" class="mb-2" />
                <p class="text-body-2 font-weight-semibold text-warning">
                  {{ uploadFile ? uploadFile.name : $t('Click to choose PDF file') }}
                </p>
                <p v-if="uploadFile" class="text-caption text-medium-emphasis">
                  {{ formatSize(uploadFile.size) }}
                </p>
                <p v-else class="text-caption text-medium-emphasis">PDF • {{ $t('Max 20MB') }}</p>
                <input
                  ref="pdfInput"
                  type="file"
                  accept=".pdf,application/pdf"
                  class="d-none"
                  @change="onFileChange"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isUploadVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn
            color="warning"
            :loading="isUploading"
            :disabled="!uploadFile"
            prepend-icon="tabler-upload"
            @click="submitUpload"
          >
            {{ $t('Upload') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- ─── Delete Attachment Confirm ────────────────────────────────────────── -->
    <VDialog v-model="isDeleteAttachVisible" max-width="400">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex align-center gap-2 text-error">
            <VIcon icon="tabler-trash" color="error" />
            {{ $t('Delete Attachment') }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <p>{{ $t('Delete attachment') }} <strong>{{ attachmentToDelete?.title }}</strong>?</p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isDeleteAttachVisible = false">{{ $t('Cancel') }}</VBtn>
          <VBtn color="error" :loading="isDeletingAttachment" @click="executeDeleteAttachment">
            {{ $t('Yes, Delete') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
