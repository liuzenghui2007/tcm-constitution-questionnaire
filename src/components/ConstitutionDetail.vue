<template>
  <q-expansion-item
    :label="`${constitutionInfo.name}（${scoreResult.judgment}）`"
    :caption="`转化分：${scoreResult.transformedScore.toFixed(1)}`"
    icon="info"
    header-class="text-weight-medium"
  >
    <q-card>
      <q-card-section>
        <!-- 详细模式 -->
        <q-list v-if="mode === 'detailed' && detailedInfo" separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>体质描述</q-item-label>
              <q-item-label>{{ detailedInfo.description }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="detailedInfo.causes.length > 0">
            <q-item-section>
              <q-item-label overline>形成原因</q-item-label>
              <div class="row q-gutter-sm q-mt-xs" style="flex-wrap: wrap">
                <q-chip
                  v-for="(cause, index) in detailedInfo.causes"
                  :key="index"
                  dense
                  color="primary"
                  text-color="white"
                >
                  {{ cause }}
                </q-chip>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>饮食调养</q-item-label>
              <q-item-label>{{ detailedInfo.dietaryAdvice }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>宜食</q-item-label>
              <q-item-label>{{ detailedInfo.recommendedFoods }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>少食</q-item-label>
              <q-item-label>{{ detailedInfo.avoidFoods }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="detailedInfo.medicinalRecipes.length > 0">
            <q-item-section>
              <q-item-label overline>推荐药膳</q-item-label>
              <q-list dense>
                <q-item v-for="(recipe, index) in detailedInfo.medicinalRecipes" :key="index">
                  <q-item-section>
                    <q-item-label>{{ recipe.name }}</q-item-label>
                    <q-item-label caption>{{ recipe.preparation }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- 简洁模式 -->
        <q-list v-else separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>主要特征</q-item-label>
              <q-item-label>{{ constitutionInfo.mainFeature }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>形体特征</q-item-label>
              <q-item-label>{{ constitutionInfo.bodyFeature }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>常见表现</q-item-label>
              <q-item-label>{{ constitutionInfo.commonSymptoms }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>心理特征</q-item-label>
              <q-item-label>{{ constitutionInfo.psychFeature }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>发病倾向</q-item-label>
              <q-item-label>{{ constitutionInfo.diseaseRisk }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>环境适应能力</q-item-label>
              <q-item-label>{{ constitutionInfo.envAdaptation }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import type {
  ConstitutionInfo,
  ScoreResult,
  DetailedConstitutionInfo,
  CopywritingMode,
} from 'src/types/constitution';

withDefaults(
  defineProps<{
    constitutionInfo: ConstitutionInfo;
    scoreResult: ScoreResult;
    detailedInfo?: DetailedConstitutionInfo | undefined;
    mode: CopywritingMode;
  }>(),
  {
    mode: 'concise',
  },
);
</script>
