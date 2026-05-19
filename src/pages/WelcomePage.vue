<template>
  <q-page class="flex flex-center">
    <div class="welcome-container q-pa-md app-content full-width">
      <h4 class="text-h4 text-center q-mb-md">中医体质分类与判定</h4>

      <IntroCard />

      <!-- 恢复进度对话框 -->
      <q-dialog v-model="showResumeDialog" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">检测到未完成的测评</div>
          </q-card-section>
          <q-card-section>
            是否继续上次的测评？
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="重新开始" color="negative" @click="handleRestart" />
            <q-btn flat label="继续" color="primary" @click="handleResume" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- 有未完成状态时显示继续选项 -->
      <div v-if="hasSaved" class="q-mb-md text-center">
        <q-btn
          outline
          color="primary"
          label="继续上次测评"
          @click="showResumeDialog = true"
          class="q-mb-sm"
        />
      </div>

      <GenderSelector v-model="selectedGender" />

      <div v-if="selectedGender" class="text-center q-mt-lg">
        <q-btn
          color="primary"
          size="lg"
          label="开始测评"
          @click="startQuiz"
          class="full-width"
          style="max-width: 300px"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Gender } from 'src/types/constitution';
import { useQuestionnaire } from 'src/composables/useQuestionnaire';
import GenderSelector from 'src/components/GenderSelector.vue';
import IntroCard from 'src/components/IntroCard.vue';

const router = useRouter();
const { setGender, restoreState, resetState, hasSavedState, gender } =
  useQuestionnaire();

const selectedGender = ref<Gender | null>(null);
const showResumeDialog = ref(false);
const hasSaved = ref(false);

onMounted(() => {
  hasSaved.value = hasSavedState();
  if (hasSaved.value) {
    showResumeDialog.value = true;
  }
});

function startQuiz() {
  if (selectedGender.value) {
    setGender(selectedGender.value);
    void router.push({ name: 'quiz' });
  }
}

function handleResume() {
  showResumeDialog.value = false;
  restoreState();
  selectedGender.value = gender.value;
  void router.push({ name: 'quiz' });
}

function handleRestart() {
  showResumeDialog.value = false;
  resetState();
  hasSaved.value = false;
}
</script>
