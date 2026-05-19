<template>
  <div class="radar-chart-container">
    <v-chart :option="chartOption" autoresize class="radar-chart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScoreResult } from 'src/types/constitution';

const props = defineProps<{
  results: ScoreResult[];
}>();

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  radar: {
    indicator: props.results.map((r) => ({
      name: r.constitutionName,
      max: 100,
    })),
    shape: 'polygon',
    splitNumber: 5,
    axisName: {
      color: '#333',
      fontSize: 12,
    },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: props.results.map((r) =>
            Math.round(r.transformedScore * 10) / 10,
          ),
          name: '体质转化分',
          areaStyle: {
            opacity: 0.3,
          },
          lineStyle: {
            width: 2,
          },
        },
      ],
    },
  ],
}));
</script>

<style scoped lang="scss">
.radar-chart-container {
  display: flex;
  justify-content: center;
}

.radar-chart {
  width: 100%;
  height: 280px;
}

/* 平板：略增高，仍占满宽度 */
@media (min-width: 600px) and (max-width: 1023.98px) {
  .radar-chart {
    height: 320px;
  }
}

@media (min-width: 1024px) {
  .radar-chart {
    width: 500px;
    height: 400px;
  }
}
</style>
