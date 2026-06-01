<script setup lang="ts">
const nodes = [
  { x: 50, y: 50, r: 14, accent: true },
  { x: 20, y: 25, r: 8, accent: false },
  { x: 80, y: 22, r: 9, accent: false },
  { x: 15, y: 75, r: 10, accent: false },
  { x: 85, y: 78, r: 8, accent: false },
  { x: 50, y: 12, r: 7, accent: false },
  { x: 50, y: 88, r: 9, accent: false },
  { x: 30, y: 50, r: 6, accent: false },
  { x: 70, y: 50, r: 6, accent: false },
];

const edges = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 5], [2, 5], [3, 6], [4, 6], [1, 7], [2, 8],
];
</script>

<template>
  <div class="relative aspect-square w-full max-w-[560px]">
    <!-- Glow orb -->
    <div class="absolute inset-10 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.16_175/0.35),transparent_70%)] blur-2xl" />
    
    <!-- Orbiting ring -->
    <div
      class="absolute inset-0 rounded-full border border-primary/20"
      v-motion
      :initial="{ rotate: 0 }"
      :enter="{ rotate: 360, transition: { duration: 40000, repeat: Infinity, ease: 'linear' } }"
    />
    <div
      class="absolute inset-8 rounded-full border border-accent/20 border-dashed"
      v-motion
      :initial="{ rotate: 0 }"
      :enter="{ rotate: -360, transition: { duration: 55000, repeat: Infinity, ease: 'linear' } }"
    />

    <svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="edge" x1="0" x2="1">
          <stop offset="0%" stop-color="oklch(0.78 0.16 175)" stop-opacity="0.9" />
          <stop offset="100%" stop-color="oklch(0.74 0.14 220)" stop-opacity="0.6" />
        </linearGradient>
        <radialGradient id="node">
          <stop offset="0%" stop-color="oklch(0.95 0.08 175)" />
          <stop offset="100%" stop-color="oklch(0.55 0.16 200)" />
        </radialGradient>
        <radialGradient id="nodeAccent">
          <stop offset="0%" stop-color="oklch(0.95 0.08 200)" />
          <stop offset="100%" stop-color="oklch(0.6 0.18 195)" />
        </radialGradient>
      </defs>

      <line
        v-for="(edge, i) in edges"
        :key="i"
        :x1="nodes[edge[0]].x" :y1="nodes[edge[0]].y"
        :x2="nodes[edge[1]].x" :y2="nodes[edge[1]].y"
        stroke="url(#edge)"
        stroke-width="0.35"
        v-motion
        :initial="{ strokeDasharray: '200', strokeDashoffset: '200', opacity: 0 }"
        :enter="{ strokeDashoffset: '0', opacity: 1, transition: { duration: 1500, delay: i * 80 } }"
      />

      <circle
        v-for="(n, i) in nodes"
        :key="i"
        :cx="n.x" :cy="n.y"
        :r="n.r / 4"
        :fill="n.accent ? 'url(#nodeAccent)' : 'url(#node)'"
        :style="`transform-origin: ${n.x}px ${n.y}px; filter: drop-shadow(0 0 2px oklch(0.78 0.16 175));`"
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1, transition: { duration: 800, delay: 1000 + i * 50 } }"
      />
    </svg>

    <!-- Floating particles -->
    <span
      v-for="i in 12"
      :key="i"
      class="absolute h-1 w-1 rounded-full bg-primary/70"
      :style="`
        top: ${((i - 1) * 53) % 100}%;
        left: ${((i - 1) * 37) % 100}%;
        animation: float-particle ${5 + ((i - 1) % 4)}s ease-in-out ${(i - 1) * 0.3}s infinite;
      `"
    />
  </div>
</template>
