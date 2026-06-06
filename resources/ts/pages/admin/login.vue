<!-- ❗Errors in the form are set on line 60 -->
<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'

import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
})

const refVForm = ref<VForm>()

const credentials = ref({
  email: 'admin@demo.com',
  password: 'admin',
})

const rememberMe = ref(false)

import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/authStore'

const isSubmitting = ref(false)
const isSuccess = ref(false)

const SUCCESS_DELAY_MS = 500

const login = async () => {
  isSubmitting.value = true
  isSuccess.value = false
  errors.value.email = undefined
  errors.value.password = undefined

  try {
    const res = await api.post('/login', {
      email: credentials.value.email,
      password: credentials.value.password,
    })

    if (res.data.user.role !== 'admin') {
      errors.value.email = 'Access denied. Admin privileges required.'
      isSubmitting.value = false
      return
    }

    const authStore = useAuthStore()
    authStore.login(res.data.user, res.data.token)

    isSubmitting.value = false
    isSuccess.value = true
    await new Promise(resolve => setTimeout(resolve, SUCCESS_DELAY_MS))
    await router.replace('/dashboards/lms')
  }
  catch (err: any) {
    console.error(err)
    isSubmitting.value = false
    isSuccess.value = false
    if (err.response?.status === 422) {
      errors.value.email = err.response.data.errors?.email?.[0] || 'Invalid credentials'
    }
    else {
      errors.value.email = 'Login failed. Please try again.'
    }
  }
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper bg-white"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-white w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 6.25rem;"
        >
          <VImg
            max-width="613"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center bg-white"
      style="background-color: #fff !important;"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4 bg-white"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Admin Login <VIcon icon="tabler-shield-lock" size="28" class="text-primary ml-2" />
          </h4>
          <p class="mb-0">
            Secure portal for administrators only.
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  label="Admin Email"
                  placeholder="admin@demo.com"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="isSubmitting"
                  :disabled="isSubmitting || isSuccess"
                  :color="isSuccess ? 'success' : undefined"
                  :prepend-icon="isSuccess ? 'tabler-check' : undefined"
                >
                  {{ isSuccess ? 'Success' : 'Secure Login' }}
                </VBtn>
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core-scss/template/pages/page-auth";
</style>
