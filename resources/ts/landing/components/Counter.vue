<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(defineProps<{
  to: number;
  suffix?: string;
  duration?: number;
}>(), {
  suffix: '',
  duration: 2,
});

const spanRef = ref<HTMLSpanElement | null>(null);
const inView = ref(false);
const v = ref(0);

let raf = 0;

watch(inView, (val) => {
  if (!val) return;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min((t - start) / (props.duration * 1000), 1);
    const eased = 1 - Math.pow(1 - p, 3);
    v.value = Math.floor(eased * props.to);
    if (p < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      v.value = props.to;
    }
  };
  raf = requestAnimationFrame(tick);
});

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      inView.value = true;
      observer.disconnect();
    }
  }, { rootMargin: '-50px' });
  
  if (spanRef.value) {
    observer.observe(spanRef.value);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
});
</script>

<template>
  <span ref="spanRef">{{ v.toLocaleString() }}{{ suffix }}</span>
</template>
