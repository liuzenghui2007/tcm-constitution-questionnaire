<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6 q-mb-sm">体质判定结果</div>

      <!-- 平和质结果 -->
      <div v-if="pingheResult" class="q-mb-md">
        <q-chip
          :color="getJudgmentColor(pingheResult.judgment)"
          text-color="white"
          size="lg"
        >
          {{ pingheResult.constitutionName }}：{{ pingheResult.judgment }}
        </q-chip>
        <div class="text-caption text-grey-7 q-mt-xs">
          转化分：{{ pingheResult.transformedScore.toFixed(1) }}
        </div>
      </div>

      <!-- 偏颇体质结果 -->
      <div v-if="significantResults.length > 0">
        <div class="text-subtitle2 q-mb-sm">偏颇体质：</div>
        <div class="row q-gutter-sm">
          <q-chip
            v-for="result in significantResults"
            :key="result.constitutionId"
            :color="getJudgmentColor(result.judgment)"
            text-color="white"
          >
            {{ result.constitutionName }}：{{ result.judgment }}
          </q-chip>
        </div>
      </div>

      <div v-else class="text-body2 text-grey-7">
        未检测到明显偏颇体质倾向
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScoreResult, JudgmentResult } from 'src/types/constitution';

const props = defineProps<{
  results: ScoreResult[];
}>();

const pingheResult = computed(() =>
  props.results.find((r) => r.constitutionId === 'pinghe'),
);

const significantResults = computed(() =>
  props.results.filter(
    (r) =>
      r.constitutionId !== 'pinghe' &&
      (r.judgment === '是' || r.judgment === '倾向是'),
  ),
);

function getJudgmentColor(judgment: JudgmentResult): string {
  switch (judgment) {
    case '是':
      return 'negative';
    case '基本是':
      return 'positive';
    case '倾向是':
      return 'warning';
    case '否':
      return 'grey';
    default:
      return 'grey';
  }
}
</script>
