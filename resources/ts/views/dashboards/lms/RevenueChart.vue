<script setup lang="ts">
const series = ref([
  {
    name: 'Revenue',
    data: [4500, 5200, 4800, 6300, 5900, 7100, 6800, 7500, 8200, 9100, 8800, 12340],
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    sparkline: { enabled: false },
    fontFamily: 'inherit',
  },
  colors: ['#7367F0'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    curve: 'smooth' as const,
    width: 3,
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#9e9e9e',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `SAR ${(val / 1000).toFixed(1)}k`,
      style: {
        colors: '#9e9e9e',
      },
    },
  },
  grid: {
    borderColor: '#e0e0e0',
    strokeDashArray: 4,
  },
  tooltip: {
    y: {
      formatter: (val: number) => `SAR ${val.toLocaleString()}`,
    },
  },
  dataLabels: { enabled: false },
}))
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>{{ $t('Revenue Growth') }}</VCardTitle>
      <VCardSubtitle>{{ $t('Monthly revenue overview') }}</VCardSubtitle>

      <template #append>
        <VChip
          color="success"
          size="small"
          label
        >
          <VIcon
            icon="tabler-arrow-up"
            size="14"
            start
          />
          +18.2% YoY
        </VChip>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        type="area"
        :height="320"
        :options="chartOptions"
        :series="series"
      />
    </VCardText>
  </VCard>
</template>
