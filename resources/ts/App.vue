<script setup lang="ts">
import { useRoute } from 'vue-router'
import { VApp } from 'vuetify/components/VApp'
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'

const route = useRoute()
const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ Conditionally bypass VApp for pure layouts to prevent Vuetify styling collisions -->
    <component 
      :is="route.meta.layout === 'pure' ? 'div' : VApp"
      :style="route.meta.layout === 'pure' ? '' : `--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`"
      :class="route.meta.layout === 'pure' ? '' : undefined"
    >
      <RouterView />
      <ScrollToTop v-if="route.meta.layout !== 'pure'" />
    </component>
  </VLocaleProvider>
</template>
