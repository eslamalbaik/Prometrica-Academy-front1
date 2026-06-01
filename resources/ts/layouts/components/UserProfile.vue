<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const router = useRouter()

const userData = useCookie<any>('userData')

import api from '@/plugins/axios'

const logout = async () => {
  try {
    await api.post('/logout')
  } catch (e) {
    console.error('Logout error:', e)
  }
  useCookie('accessToken').value = null
  userData.value = null
  useCookie('userData').value = null
  await router.push('/')
}

const isStudent = computed(() => userData.value?.role === 'student')

const userProfileList = computed(() => {
  if (isStudent.value) {
    return [
      { type: 'divider' },
      { type: 'navItem', icon: 'tabler-layout-dashboard', title: 'لوحتي', to: { name: 'student-dashboard' } },
      { type: 'navItem', icon: 'tabler-book', title: 'دوراتي', to: { name: 'student-courses' } },
      { type: 'divider' },
      { type: 'navItem', icon: 'tabler-certificate', title: 'شهاداتي', to: { name: 'certificates' } },
    ]
  }
  return [
    { type: 'divider' },
    { type: 'navItem', icon: 'tabler-layout-dashboard', title: 'Dashboard', to: { name: 'dashboards-lms' } },
    { type: 'navItem', icon: 'tabler-settings', title: 'Settings', to: { name: 'settings' } },
    { type: 'divider' },
    { type: 'navItem', icon: 'tabler-users', title: 'Students', to: { name: 'students' } },
  ]
})
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    bordered
    location="bottom right"
    offset-x="1"
    offset-y="2"
    color="success"
  >
    <VAvatar
      size="38"
      class="cursor-pointer"
      :color="!(userData && userData.avatar) ? 'primary' : undefined"
      :variant="!(userData && userData.avatar) ? 'tonal' : undefined"
    >
      <VImg
        v-if="userData && userData.avatar"
        :src="userData.avatar"
      />
      <VIcon
        v-else
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="240"
        location="bottom end"
        offset="12px"
      >
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                  bordered
                >
                  <VAvatar
                    :color="!(userData && userData.avatar) ? 'primary' : undefined"
                    :variant="!(userData && userData.avatar) ? 'tonal' : undefined"
                  >
                    <VImg
                      v-if="userData && userData.avatar"
                      :src="userData.avatar"
                    />
                    <VIcon
                      v-else
                      icon="tabler-user"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>

              <div>
                <h6 class="text-h6 font-weight-medium">
                  {{ userData.fullName || userData.username }}
                </h6>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData.role }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :to="item.to"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge
                    rounded="sm"
                    class="me-3"
                    v-bind="item.badgeProps"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-2"
              />
            </template>

            <div class="px-4 py-2">
              <VBtn
                block
                size="small"
                color="error"
                append-icon="tabler-logout"
                @click="logout"
              >
                Logout
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
