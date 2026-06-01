<script setup lang="ts">
import { Pill, Activity, Award, Stethoscope } from "lucide-vue-next";
import hero from "@/assets/hero-pharmacists.png";
</script>

<template>
  <div class="relative aspect-square w-full max-w-[560px]">
    <!-- Background ring/blob -->
    <div class="absolute inset-6 rounded-full bg-gradient-to-br from-accent via-accent/80 to-[oklch(0.7_0.13_200)]" />
    <div class="absolute inset-0 rounded-full blob opacity-70" />

    <!-- Orbiting dashed rings -->
    <div
      class="absolute inset-0 rounded-full border border-dashed border-primary/20"
      v-motion
      :initial="{ rotate: 0 }"
      :enter="{ rotate: 360, transition: { duration: 50000, repeat: Infinity, ease: 'linear' } }"
    />
    <div
      class="absolute -inset-4 rounded-full border border-accent/20"
      v-motion
      :initial="{ rotate: 0 }"
      :enter="{ rotate: -360, transition: { duration: 70000, repeat: Infinity, ease: 'linear' } }"
    />

    <!-- Photo -->
    <img
      :src="hero"
      alt="Healthcare professionals"
      width="1024"
      height="1024"
      class="relative z-10 h-full w-full object-contain drop-shadow-2xl"
      v-motion
      :initial="{ opacity: 0, y: 20, scale: 0.95 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 900, delay: 200 } }"
    />

    <!-- Floating stat badges -->
    <div
      class="absolute left-0 top-20 z-20 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
      v-motion
      :initial="{ opacity: 0, x: -20 }"
      :enter="{ opacity: 1, x: 0, transition: { delay: 800 } }"
    >
      <span class="animate-float-y inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Award class="h-4 w-4" />
      </span>
      <div>
        <div class="text-xs text-muted-foreground">Pass Rate</div>
        <div class="text-sm font-bold">98%</div>
      </div>
    </div>

    <div
      class="absolute right-0 top-1/3 z-20 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
      v-motion
      :initial="{ opacity: 0, x: 20 }"
      :enter="{ opacity: 1, x: 0, transition: { delay: 1000 } }"
    >
      <span class="animate-float-y inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[oklch(0.78_0.16_55/0.15)] text-[oklch(0.65_0.16_55)]" style="animation-delay: 1s;">
        <Pill class="h-4 w-4" />
      </span>
      <div>
        <div class="text-xs text-muted-foreground">Pharmacists</div>
        <div class="text-sm font-bold">5,000+</div>
      </div>
    </div>

    <div
      class="absolute bottom-10 left-6 z-20 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 1200 } }"
    >
      <span class="animate-float-y inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent" style="animation-delay: 2s;">
        <Activity class="h-4 w-4" />
      </span>
      <div>
        <div class="text-xs text-muted-foreground">Live cohorts</div>
        <div class="text-sm font-bold">Weekly</div>
      </div>
    </div>

    <!-- Floating icons -->
    <Stethoscope class="absolute -right-2 bottom-24 h-7 w-7 text-primary/30 animate-float-rot" />
  </div>
</template>
