<script setup lang="ts">
definePage({ meta: { requiresAdmin: true } })

const currentTab = ref('general')
</script>

<template>
  <div>
    <h4 class="text-h4 mb-6">{{ $t('Settings') }}</h4>

    <VRow>
      <VCol cols="12" md="3">
        <VCard>
          <VList nav>
            <VListItem
              value="general"
              prepend-icon="tabler-settings"
              :title="$t('General')"
              :active="currentTab === 'general'"
              @click="currentTab = 'general'"
            />
            <VListItem
              value="branding"
              prepend-icon="tabler-palette"
              :title="$t('Branding')"
              :active="currentTab === 'branding'"
              @click="currentTab = 'branding'"
            />
            <VListItem
              value="email"
              prepend-icon="tabler-mail"
              :title="$t('Email (SMTP)')"
              :active="currentTab === 'email'"
              @click="currentTab = 'email'"
            />
            <VListItem
              value="payments"
              prepend-icon="tabler-credit-card"
              :title="$t('Payments')"
              :active="currentTab === 'payments'"
              @click="currentTab = 'payments'"
            />
            <VListItem
              value="ai"
              prepend-icon="tabler-brain"
              :title="$t('AI (Gemini)')"
              :active="currentTab === 'ai'"
              @click="currentTab = 'ai'"
            />
            <VListItem
              value="security"
              prepend-icon="tabler-shield-lock"
              :title="$t('Security')"
              :active="currentTab === 'security'"
              @click="currentTab = 'security'"
            />
          </VList>
        </VCard>
      </VCol>

      <VCol cols="12" md="9">
        <VCard>
          <!-- General -->
          <VCardText v-if="currentTab === 'general'">
            <h5 class="text-h5 mb-4">{{ $t('General Settings') }}</h5>
            <VTextField :label="$t('Site Name')" placeholder="Pharmacy LMS" class="mb-4" />
            <VFileInput :label="$t('Logo')" accept="image/*" class="mb-4" />
            <VFileInput :label="$t('Favicon')" accept="image/*" class="mb-4" />
            <VBtn color="primary">{{ $t('Save Changes') }}</VBtn>
          </VCardText>

          <!-- Branding -->
          <VCardText v-if="currentTab === 'branding'">
            <h5 class="text-h5 mb-4">Branding</h5>
            <VTextField label="Primary Color" placeholder="#7C3AED" class="mb-4" />
            <VTextField label="Secondary Color" placeholder="#06B6D4" class="mb-4" />
            <VSelect label="Font Family" :items="['Inter', 'Roboto', 'Outfit', 'Cairo']" class="mb-4" />
            <VBtn color="primary">Save Changes</VBtn>
          </VCardText>

          <!-- Email -->
          <VCardText v-if="currentTab === 'email'">
            <h5 class="text-h5 mb-4">Email Settings (SMTP)</h5>
            <VTextField label="SMTP Host" placeholder="smtp.gmail.com" class="mb-4" />
            <VTextField label="SMTP Port" placeholder="587" class="mb-4" />
            <VTextField label="SMTP Username" class="mb-4" />
            <VTextField label="SMTP Password" type="password" class="mb-4" />
            <VTextField label="From Email" placeholder="noreply@pharmacy-lms.com" class="mb-4" />
            <VTextField label="From Name" placeholder="Pharmacy LMS" class="mb-4" />
            <VBtn color="primary">Save Changes</VBtn>
          </VCardText>

          <!-- Payments -->
          <VCardText v-if="currentTab === 'payments'">
            <h5 class="text-h5 mb-4">Payment Gateway Settings</h5>
            <VSelect label="Payment Provider" :items="['Moyasar', 'Tap', 'HyperPay']" class="mb-4" />
            <VTextField label="API Key" class="mb-4" />
            <VTextField label="Secret Key" type="password" class="mb-4" />
            <VSwitch label="Test Mode" class="mb-4" />
            <VBtn color="primary">Save Changes</VBtn>
          </VCardText>

          <!-- AI -->
          <VCardText v-if="currentTab === 'ai'">
            <h5 class="text-h5 mb-4">AI Settings (Gemini)</h5>
            <VTextField label="Gemini API Key" type="password" class="mb-4" />
            <VSwitch label="Enable AI Quiz Generation" class="mb-4" />
            <VSwitch label="Enable Smart Summaries" class="mb-4" />
            <VSwitch label="Enable Student Analysis" class="mb-4" />
            <VBtn color="primary">Save Changes</VBtn>
          </VCardText>

          <!-- Security -->
          <VCardText v-if="currentTab === 'security'">
            <h5 class="text-h5 mb-4">Security Settings</h5>
            <VTextField label="Max Devices Per Account" type="number" placeholder="2" class="mb-4" />
            <VSwitch label="Enable Device Fingerprinting" class="mb-4" />
            <VSwitch label="Enable OTP Login" class="mb-4" />
            <VSwitch label="Enable Google Login" class="mb-4" />
            <VSwitch label="Force Email Verification" class="mb-4" />
            <VBtn color="primary">Save Changes</VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
