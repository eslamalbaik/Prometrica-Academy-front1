<script setup lang="ts">
definePage({
  meta: {
    requiresAdmin: true,
  },
})
import { ref, onMounted } from 'vue'
import { useCookie } from '@core/composable/useCookie'

const courses = ref<any[]>([])
const isLoading = ref(true)

const fetchCourses = async () => {
  try {
    const token = useCookie('accessToken').value
    const response = await fetch('/api/dashboard/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    courses.value = data
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCourses()
})

const deleteCourse = async (id: number) => {
  if (!confirm('Are you sure you want to delete this course?')) return
  
  try {
    const token = useCookie('accessToken').value
    await fetch(`/api/dashboard/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    await fetchCourses()
  } catch (error) {
    console.error('Failed to delete course:', error)
  }
}
</script>

<template>
  <div>
    <VCard>
      <VCardItem>
        <VCardTitle class="d-flex align-center gap-2">
          <VIcon icon="tabler-book-2" />
          {{ $t('All Courses') }}
        </VCardTitle>
        <VCardSubtitle>{{ $t('Manage your pharmacy courses') }}</VCardSubtitle>

        <template #append>
          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            :to="{ name: 'courses-create' }"
          >
            {{ $t('Create Course') }}
          </VBtn>
        </template>
      </VCardItem>

      <VCardText>
        <!-- Placeholder data table -->
        <VTable>
          <thead>
            <tr>
              <th>{{ $t('Course') }}</th>
              <th>{{ $t('Category') }}</th>
              <th>{{ $t('Students') }}</th>
              <th>{{ $t('Price') }}</th>
              <th>{{ $t('Status') }}</th>
              <th>{{ $t('Actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center text-medium-emphasis pa-8">
                Loading courses...
              </td>
            </tr>
            <tr v-else-if="courses.length === 0">
              <td colspan="6" class="text-center text-medium-emphasis pa-8">
                {{ $t('No courses yet. Create your first course to get started.') }}
              </td>
            </tr>
            <tr v-for="course in courses" :key="course.id" v-else>
              <td>
                <div class="d-flex align-center gap-3">
                  <VAvatar rounded variant="tonal" color="primary" class="me-3" size="38">
                    <VImg v-if="course.thumbnail" :src="'/storage/' + course.thumbnail" />
                    <VIcon v-else icon="tabler-book" size="24" />
                  </VAvatar>
                  <div class="d-flex flex-column">
                    <span class="text-subtitle-2 font-weight-medium text-high-emphasis">{{ course.title }}</span>
                    <span class="text-caption text-medium-emphasis">{{ course.slug }}</span>
                  </div>
                </div>
              </td>
              <td>
                <VChip size="small" variant="tonal" color="info">{{ course.category ? $t(course.category) : 'N/A' }}</VChip>
              </td>
              <td>0</td>
              <td>{{ course.is_free ? 'Free' : (course.price + ' SAR') }}</td>
              <td>
                <VChip size="small" variant="elevated" :color="course.status === 'Published' ? 'success' : 'secondary'">
                  {{ course.status ? $t(course.status) : 'Draft' }}
                </VChip>
              </td>
              <td>
                <VBtn icon="tabler-edit" variant="text" size="small" color="medium-emphasis" />
                <VBtn icon="tabler-trash" variant="text" size="small" color="error" @click="deleteCourse(course.id)" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </div>
</template>
