<template>
  <q-page class="quiz-page">
    <div class="app-content">
      <ProgressBar
        :progress="progress"
        :current="quizDisplayMode === 'single' ? currentPage + 1 : answeredCount"
        :total="filteredQuestions.length"
      />

      <div class="q-pa-md">
        <!-- 未回答提示 -->
        <q-banner
          v-if="unansweredQuestions.length > 0 && showUnansweredHint"
          class="q-mb-md bg-warning text-white"
          rounded
        >
          <template v-slot:avatar>
            <q-icon name="warning" />
          </template>
          还有 {{ unansweredQuestions.length }} 题未回答
          <template v-slot:action>
            <q-btn flat label="前往" @click="goToFirstUnanswered" />
          </template>
        </q-banner>

        <!-- 单题模式 -->
        <template v-if="quizDisplayMode === 'single'">
          <QuestionCard
            v-if="currentQuestion"
            :question="currentQuestion"
            :question-index="currentPage + 1"
            :model-value="answers[currentQuestion.id]"
            @update:model-value="handleAnswer($event)"
          />
        </template>

        <!-- 全部显示模式 -->
        <template v-else>
          <QuestionCard
            v-for="(question, index) in filteredQuestions"
            :key="question.id"
            :question="question"
            :question-index="index + 1"
            :model-value="answers[question.id]"
            @update:model-value="setAnswer(question.id, $event)"
          />
        </template>
      </div>

      <!-- 单题模式：上一题/下一题导航 -->
      <NavigationButtons
        v-if="quizDisplayMode === 'single'"
        :is-first="currentPage === 0"
        :is-last="currentPage === filteredQuestions.length - 1"
        :can-submit="canSubmit"
        @prev="prevQuestion"
        @next="nextQuestion"
        @submit="submitQuiz"
        @goto-unanswered="goToFirstUnanswered"
      />

      <!-- 全部显示模式：提交按钮 -->
      <div v-else class="q-pa-md text-center">
        <q-btn color="primary" size="lg" label="提交" :disable="!canSubmit" @click="submitQuiz" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaire } from 'src/composables/useQuestionnaire';
import { useQuasar } from 'quasar';
import ProgressBar from 'src/components/ProgressBar.vue';
import QuestionCard from 'src/components/QuestionCard.vue';
import NavigationButtons from 'src/components/NavigationButtons.vue';
import appConfig from 'src/config/app-config';

const router = useRouter();
const $q = useQuasar();
const quizDisplayMode = appConfig.quizDisplayMode;
const {
  gender,
  answers,
  currentPage,
  filteredQuestions,
  progress,
  canSubmit,
  unansweredQuestions,
  setAnswer,
  setCurrentPage,
  setCompleted,
} = useQuestionnaire();

const showUnansweredHint = ref(false);

onMounted(() => {
  // 路由守卫：未选择性别时重定向到 Welcome 页
  if (!gender.value) {
    void router.replace({ name: 'welcome' });
  }
});

const currentQuestion = computed(() => {
  return filteredQuestions.value[currentPage.value] || null;
});

const answeredCount = computed(() => {
  return filteredQuestions.value.filter((q) => answers.value[q.id] !== undefined).length;
});

function handleAnswer(value: number) {
  if (!currentQuestion.value) return;
  setAnswer(currentQuestion.value.id, value);
  const lastIndex = filteredQuestions.value.length - 1;
  if (currentPage.value < lastIndex) {
    void nextTick(() => {
      setCurrentPage(currentPage.value + 1);
    });
  }
}

function prevQuestion() {
  if (currentPage.value > 0) {
    setCurrentPage(currentPage.value - 1);
  }
}

function nextQuestion() {
  if (currentPage.value < filteredQuestions.value.length - 1) {
    setCurrentPage(currentPage.value + 1);
  }
}

function goToFirstUnanswered() {
  const firstUnanswered = unansweredQuestions.value[0];
  if (firstUnanswered) {
    const index = filteredQuestions.value.findIndex((q) => q.id === firstUnanswered.id);
    if (index >= 0) {
      setCurrentPage(index);
    }
  }
}

function submitQuiz() {
  if (!canSubmit.value) {
    showUnansweredHint.value = true;
    $q.notify({
      type: 'warning',
      message: `还有 ${unansweredQuestions.value.length} 题未回答，请完成所有题目后再提交`,
      position: 'top',
    });
    goToFirstUnanswered();
    return;
  }
  setCompleted(true);
  void router.push({ name: 'result' });
}
</script>

<style scoped lang="scss">
.quiz-page {
  padding-bottom: 88px;
}

/* 手机：题目卡片占满内容宽度 */
@media (max-width: 599.98px) {
  .app-content :deep(.question-card) {
    width: 100%;
  }
}

/* 平板及以上：题目区额外水平留白（与全局 .app-content 叠加） */
@media (min-width: 600px) {
  .app-content .q-pa-md {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>
