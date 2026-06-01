<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Menu, X } from "lucide-vue-next";
import logo from "@/assets/prometrica-logo.png";
import { useCookie } from '@core/composable/useCookie';

const userData = useCookie('userData');
const accessToken = useCookie('accessToken');
const isLoggedIn = computed(() => !!(userData.value && accessToken.value));
const role = computed(() => userData.value?.role || 'student');
const dashboardLink = computed(() => role.value === 'admin' ? '/dashboards/lms' : '/student/dashboard');

const links = [
  { href: "#programs", label: "Programs" },
  { href: "#why", label: "Why Us" },
  { href: "#courses", label: "Courses" },
  { href: "#speakers", label: "Speakers" },
  { href: "#contact", label: "Contact" },
];

const scrolled = ref(false);
const open = ref(false);

const onScroll = () => {
  scrolled.value = window.scrollY > 30;
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <header :class="['fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-2' : 'py-4']">
    <div
      v-motion
      :initial="{ y: -30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 600 } }"
      :class="[
        'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 md:px-6',
        scrolled
          ? 'rounded-2xl border border-border/70 bg-card/85 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl'
          : 'py-3'
      ]"
    >
      <a href="#top" class="flex items-center gap-2">
        <img :src="logo" alt="Prometrica Academy" class="h-9 w-auto md:h-10" />
      </a>
      <nav class="hidden items-center gap-8 lg:flex">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {{ l.label }}
          <span class="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
        </a>
      </nav>
      <div class="flex items-center gap-2">
        <template v-if="!isLoggedIn">
          <RouterLink to="/login" class="hidden text-sm font-medium text-muted-foreground hover:text-primary md:inline-block">
            Log in
          </RouterLink>
          <RouterLink
            to="/register"
            class="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-accent hover:text-accent-foreground"
          >
            <span>Register</span>
            <span class="h-1.5 w-1.5 rounded-full bg-accent transition group-hover:bg-primary" />
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            :to="dashboardLink"
            class="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-accent hover:text-accent-foreground"
          >
            <span>Dashboard</span>
            <span class="h-1.5 w-1.5 rounded-full bg-accent transition group-hover:bg-primary" />
          </RouterLink>
        </template>
        <button
          @click="open = !open"
          class="ml-1 rounded-md border border-border p-2 lg:hidden"
          aria-label="Menu"
        >
          <component :is="open ? X : Menu" class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div
      v-if="open"
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0 }"
      :leave="{ opacity: 0, y: -10 }"
      class="mx-4 mt-2 rounded-2xl border border-border bg-card p-4 shadow-lg lg:hidden"
    >
      <div class="flex flex-col gap-3">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          @click="open = false"
          class="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          {{ l.label }}
        </a>
      </div>
    </div>
  </header>
</template>
