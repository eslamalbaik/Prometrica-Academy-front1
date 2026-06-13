<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'
import api from '@/plugins/axios'

definePage({ meta: { requiresAdmin: true } })

const queryClient = useQueryClient()
const searchQuery = ref('')
const searchDebounced = ref('')
let debounceTimeout: any = null

// Debounce search input (400ms)
watch(searchQuery, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    searchDebounced.value = newVal || ''
  }, 400)
})

// Fetch standalone questions using TanStack useInfiniteQuery
const fetchQuestions = async ({ pageParam }: { pageParam?: string }) => {
  const res = await api.get('/api/v1/tenant/questions', {
    params: {
      cursor: pageParam || undefined,
      search: searchDebounced.value || undefined
    }
  })
  return res.data
}

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: ['questions', searchDebounced],
  queryFn: fetchQuestions,
  getNextPageParam: (lastPage: any) => lastPage.next_cursor || undefined,
  initialPageParam: ''
})

// Flatten questions list from all loaded pages
const allQuestions = computed(() => {
  if (!data.value) return []
  return data.value.pages.flatMap((page: any) => page.data || [])
})

// Standing CRUD Dialog State
const isQuestionDialog = ref(false)
const isSubmitting = ref(false)
const editingQuestion = ref<any>(null)

const questionForm = ref({
  question_text: '',
  options: [
    { option_text: '', is_correct: true,  image: null as File | null, image_path: null as string | null },
    { option_text: '', is_correct: false, image: null as File | null, image_path: null as string | null }
  ]
})

const openCreateDialog = () => {
  editingQuestion.value = null
  questionForm.value = {
    question_text: '',
    options: [
      { option_text: '', is_correct: true,  image: null, image_path: null },
      { option_text: '', is_correct: false, image: null, image_path: null }
    ]
  }
  isQuestionDialog.value = true
}

const openEditDialog = (q: any) => {
  editingQuestion.value = q
  questionForm.value = {
    question_text: q.question_text,
    options: q.options.map((o: any) => ({
      option_text: o.option_text,
      is_correct: !!o.is_correct,
      image: null,
      image_path: o.image_path || null
    }))
  }
  isQuestionDialog.value = true
}

const addOption = () => {
  questionForm.value.options.push({ option_text: '', is_correct: false, image: null, image_path: null })
}

// Cache object URLs to avoid creating new ones on every render
const objectUrlCache = new Map<File, string>()

const getObjectUrl = (file: File): string => {
  if (!objectUrlCache.has(file)) {
    objectUrlCache.set(file, URL.createObjectURL(file))
  }
  return objectUrlCache.get(file)!
}

const revokeObjectUrl = (file: File | null) => {
  if (file && objectUrlCache.has(file)) {
    URL.revokeObjectURL(objectUrlCache.get(file)!)
    objectUrlCache.delete(file)
  }
}

const onOptionFileInputChange = (idx: number, files: File[]) => {
  const file = files?.[0] ?? null
  revokeObjectUrl(questionForm.value.options[idx].image)
  questionForm.value.options[idx].image = file
  if (file) questionForm.value.options[idx].image_path = null
}

const removeOptionImage = (idx: number) => {
  revokeObjectUrl(questionForm.value.options[idx].image)
  questionForm.value.options[idx].image = null
  questionForm.value.options[idx].image_path = null
}

const getOptionImagePreview = (idx: number): string | null => {
  const opt = questionForm.value.options[idx]
  if (!opt) return null
  if (opt.image) return getObjectUrl(opt.image)
  if (opt.image_path) return `/storage/${opt.image_path}`
  return null
}

const removeOption = (idx: number) => {
  questionForm.value.options.splice(idx, 1)
}

const setCorrectOption = (idx: number) => {
  questionForm.value.options.forEach((opt, oIdx) => {
    opt.is_correct = (oIdx === idx)
  })
}


const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmText = ref('')
const onConfirm = ref<(() => void) | null>(null)
const isConfirmLoading = ref(false)

const showConfirm = (title: string, text: string, action: () => void) => {
  confirmTitle.value = title
  confirmText.value = text
  onConfirm.value = action
  isConfirmOpen.value = true
}

const cancelConfirm = () => {
  isConfirmOpen.value = false
  onConfirm.value = null
}

const executeConfirm = async () => {
  if (onConfirm.value) {
    isConfirmLoading.value = true
    try {
      await onConfirm.value()
    } finally {
      isConfirmLoading.value = false
      isConfirmOpen.value = false
      onConfirm.value = null
    }
  }
}

const isAlertOpen = ref(false)
const alertTitle = ref('')
const alertText = ref('')

const showAlert = (title: string, text: string) => {
  alertTitle.value = title
  alertText.value = text
  isAlertOpen.value = true
}

const saveQuestion = async () => {
  if (!questionForm.value.question_text.trim()) {
    showAlert('Validation Error', 'Question text is required.')
    return
  }

  const correctCount = questionForm.value.options.filter(o => o.is_correct).length
  if (correctCount !== 1) {
    showAlert('Validation Error', 'Please select exactly one correct option.')
    return
  }

  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('question_text', questionForm.value.question_text)

    questionForm.value.options.forEach((opt, i) => {
      formData.append(`options[${i}][option_text]`, opt.option_text)
      formData.append(`options[${i}][is_correct]`, opt.is_correct ? '1' : '0')
      if (opt.image) {
        formData.append(`option_images[${i}]`, opt.image)
      }
    })

    if (editingQuestion.value) {
      formData.append('_method', 'PUT')
      await api.post(`/api/v1/tenant/questions/${editingQuestion.value.id}`, formData)
    } else {
      await api.post('/api/v1/tenant/questions', formData)
    }
    isQuestionDialog.value = false
    queryClient.invalidateQueries({ queryKey: ['questions'] })
  } catch (error: any) {
    console.error(error)
    showAlert('Error', error?.response?.data?.message || 'Failed to save question.')
  } finally {
    isSubmitting.value = false
  }
}

const deleteQuestion = (id: number) => {
  showConfirm(
    'Delete Question',
    'Are you sure you want to delete this question? This will remove it from all associated quizzes.',
    async () => {
      try {
        await api.delete(`/api/v1/tenant/questions/${id}`)
        queryClient.invalidateQueries({ queryKey: ['questions'] })
      } catch (error) {
        console.error(error)
        showAlert('Error', 'Failed to delete question.')
      }
    }
  )
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="tabler-database" />
        {{ $t('question.bank.title', 'Question Bank') }}
      </VCardTitle>
      <VCardSubtitle>{{ $t('question.bank.subtitle', 'Manage standalone questions and answers') }}</VCardSubtitle>

      <template #append>
        <div class="d-flex gap-2">
          <VBtn color="primary" prepend-icon="tabler-plus" size="small" @click="openCreateDialog">
            {{ $t('question.bank.add_question', 'Add Question') }}
          </VBtn>
          <VBtn color="secondary" prepend-icon="tabler-clipboard-check" size="small" to="/quizzes/exams">
            {{ $t('common.actions.manage_quizzes', 'Manage Quizzes') }}
          </VBtn>
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <!-- Search Field -->
      <VTextField
        v-model="searchQuery"
        :placeholder="$t('question.bank.search_placeholder', 'Search questions...')"
        prepend-inner-icon="tabler-search"
        variant="outlined"
        clearable
        class="mb-6"
      />

      <div v-if="isLoading" class="d-flex justify-center pa-8">
        <VProgressCircular indeterminate color="primary" />
      </div>

      <div v-else>
        <VTable class="border rounded">
          <thead>
            <tr>
              <th style="min-width: 350px;">{{ $t('question.bank.question', 'Question') }}</th>
              <th>{{ $t('question.bank.options', 'Options') }}</th>
              <th class="text-center">{{ $t('common.actions.title', 'Actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in allQuestions" :key="q.id">
              <td class="py-3">
                <span class="font-weight-medium d-block text-body-1">{{ q.question_text }}</span>
              </td>
              <td>
                <div class="d-flex flex-column gap-1 my-2">
                  <div
                    v-for="o in q.options"
                    :key="o.id"
                    class="text-caption d-flex align-center gap-1"
                    :class="o.is_correct ? 'text-success font-weight-bold' : 'text-medium-emphasis'"
                  >
                    <VIcon :icon="o.is_correct ? 'tabler-circle-check-filled' : 'tabler-circle'" size="14" />
                    <VImg v-if="o.image_path" :src="`/storage/${o.image_path}`" width="24" height="24" cover class="rounded" />
                    <span>{{ o.option_text }}</span>
                  </div>
                </div>
              </td>
              <td class="text-center">
                <div class="d-flex gap-1 justify-center">
                  <VBtn icon="tabler-edit" variant="text" size="small" color="primary" @click="openEditDialog(q)" />
                  <VBtn icon="tabler-trash" variant="text" size="small" color="error" @click="deleteQuestion(q.id)" />
                </div>
              </td>
            </tr>
            <tr v-if="allQuestions.length === 0">
              <td colspan="3" class="text-center text-medium-emphasis pa-8">
                {{ $t('question.bank.no_results', 'No questions in the bank yet.') }}
              </td>
            </tr>
          </tbody>
        </VTable>

        <!-- Infinite Load More Button -->
        <div v-if="hasNextPage" class="text-center mt-6">
          <VBtn
            color="primary"
            variant="outlined"
            :loading="isFetchingNextPage"
            prepend-icon="tabler-arrow-down"
            @click="() => fetchNextPage()"
          >
            {{ $t('common.actions.load_more', 'Load More Questions') }}
          </VBtn>
        </div>
      </div>
    </VCardText>

    <!-- Create/Edit Question Dialog -->
    <VDialog v-model="isQuestionDialog" max-width="600" scrollable>
      <VCard>
        <VCardTitle class="pa-6 bg-primary text-white d-flex justify-space-between align-center">
          <span>{{ editingQuestion ? $t('question.bank.edit_title', 'Edit Question') : $t('question.bank.create_title', 'Create Question') }}</span>
          <VBtn icon="tabler-x" variant="text" size="small" color="white" @click="isQuestionDialog = false" />
        </VCardTitle>

        <VCardText class="pa-6">
          <VTextarea 
            v-model="questionForm.question_text" 
            :label="$t('question.bank.question_text', 'Question Text')" 
            rows="3" 
            variant="outlined" 
            class="mb-4"
            required
          />

          <div class="text-subtitle-1 font-weight-bold mb-3">{{ $t('question.bank.options_title', 'Options (Select the correct one)') }}</div>

          <div v-for="(opt, oIdx) in questionForm.options" :key="oIdx" class="mb-3 pa-3 border rounded">
            <!-- Option row -->
            <div class="d-flex align-center gap-2">
              <!-- Custom radio circle -->
              <div
                style="width:20px; height:20px; border-radius:50%; border:2px solid #aaa; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:border-color .2s;"
                :style="opt.is_correct ? 'border-color:#4CAF50; background:#4CAF50;' : ''"
                @click="setCorrectOption(oIdx)"
              >
                <div v-if="opt.is_correct" style="width:8px; height:8px; border-radius:50%; background:#fff;" />
              </div>

              <VTextField
                v-model="opt.option_text"
                :label="`${$t('question.bank.option', 'Option')} ${oIdx + 1}`"
                variant="outlined"
                density="compact"
                hide-details
                class="flex-grow-1"
              />

              <VBtn
                v-if="questionForm.options.length > 2"
                icon="tabler-trash"
                variant="text"
                color="error"
                size="small"
                @click="removeOption(oIdx)"
              />
            </div>

            <!-- Image upload row -->
            <div class="d-flex align-center gap-2 mt-2" style="padding-inline-start: 28px;">
              <img
                v-if="getOptionImagePreview(oIdx)"
                :src="getOptionImagePreview(oIdx)!"
                style="width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #ddd; flex-shrink:0;"
              />
              <VFileInput
                clearable
                hide-details
                density="compact"
                variant="outlined"
                prepend-icon=""
                prepend-inner-icon="tabler-camera"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                :placeholder="$t('question.bank.add_image', 'Add Image')"
                style="max-width: 200px;"
                @update:model-value="(f: any) => onOptionFileInputChange(oIdx, f)"
                @click:clear="removeOptionImage(oIdx)"
              />
            </div>
          </div>

          <VBtn variant="text" size="small" color="primary" prepend-icon="tabler-plus" @click="addOption">
            {{ $t('question.bank.add_option', 'Add Option') }}
          </VBtn>
        </VCardText>

        <VCardActions class="pa-6 border-t bg-grey-lighten-5 justify-end">
          <VBtn variant="text" color="secondary" @click="isQuestionDialog = false">{{ $t('common.actions.cancel', 'Cancel') }}</VBtn>
          <VBtn color="primary" variant="elevated" :loading="isSubmitting" @click="saveQuestion">
            {{ $t('common.actions.save', 'Save Question') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Confirm Dialog -->
    <VDialog v-model="isConfirmOpen" max-width="450" persistent>
      <VCard class="text-center pa-6">
        <VCardText class="pt-6">
          <VIcon icon="tabler-alert-triangle" size="64" color="warning" class="mb-4" />
          <h3 class="text-h5 mb-2">{{ confirmTitle }}</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ confirmText }}
          </p>
        </VCardText>
        <VCardActions class="justify-center gap-4">
          <VBtn variant="text" color="secondary" @click="cancelConfirm">
            {{ $t('common.actions.cancel', 'Cancel') }}
          </VBtn>
          <VBtn color="error" variant="elevated" :loading="isConfirmLoading" @click="executeConfirm">
            {{ $t('common.actions.confirm_delete', 'Delete') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Alert Dialog -->
    <VDialog v-model="isAlertOpen" max-width="400">
      <VCard class="text-center pa-6">
        <VCardText class="pt-6">
          <VIcon icon="tabler-alert-circle" size="64" color="error" class="mb-4" />
          <h3 class="text-h5 mb-2">{{ alertTitle }}</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ alertText }}
          </p>
        </VCardText>
        <VCardActions class="justify-center">
          <VBtn color="primary" variant="elevated" @click="isAlertOpen = false">
            {{ $t('common.actions.ok', 'OK') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
