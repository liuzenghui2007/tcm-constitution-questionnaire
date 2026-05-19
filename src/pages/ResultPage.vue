<template>
  <q-page class="q-pa-md">
    <div class="app-content">
      <h5 class="text-h5 text-center q-mb-md">体质判定结果</h5>

      <!-- 总结 -->
      <ScoreSummary :results="results" />

      <!-- 雷达图 -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">体质转化分雷达图</div>
          <RadarChart :results="results" />
        </q-card-section>
      </q-card>

      <!-- 体质详情列表 -->
      <q-card class="q-mb-md" v-if="significantResults.length > 0">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">体质详情</div>
        </q-card-section>
        <ConstitutionDetail
          v-for="result in significantResults"
          :key="result.constitutionId"
          :constitution-info="getInfo(result.constitutionId)!"
          :score-result="result"
          :mode="mode"
          :detailed-info="getDetailedConstitutionInfo(result.constitutionId)"
        />
      </q-card>

      <!-- 重新测评按钮 -->
      <div class="text-center q-mt-lg q-mb-xl">
        <q-btn color="primary" outline label="重新测评" icon="refresh" @click="handleRestart" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from 'src/composables/useQuestionnaire';
import { useConstitution } from 'src/composables/useConstitution';
import ScoreSummary from 'src/components/ScoreSummary.vue';
import RadarChart from 'src/components/RadarChart.vue';
import ConstitutionDetail from 'src/components/ConstitutionDetail.vue';

const router = useRouter();
const { gender, answers, completed, resetState } = useQuestionnaire();
const { results, mode, evaluate, getConstitutionInfo, getDetailedConstitutionInfo } =
  useConstitution();

onMounted(() => {
  // 路由守卫：未完成问卷时重定向到 Welcome 页
  if (!completed.value || !gender.value) {
    void router.replace({ name: 'welcome' });
    return;
  }
  // 计算结果
  evaluate(answers.value, gender.value);
});

const significantResults = computed(() =>
  results.value.filter((r) => r.judgment === '是' || r.judgment === '倾向是'),
);

function getInfo(id: string) {
  return getConstitutionInfo(id);
}

function handleRestart() {
  resetState();
  void router.push({ name: 'welcome' });
}
</script>
