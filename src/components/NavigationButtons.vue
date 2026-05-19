<template>
  <div class="navigation-buttons">
    <div class="row q-gutter-sm justify-between">
      <q-btn
        v-if="!isFirst"
        flat
        color="primary"
        icon="arrow_back"
        label="上一题"
        @click="$emit('prev')"
      />
      <div v-else></div>

      <q-btn
        v-if="!isLast"
        color="primary"
        icon-right="arrow_forward"
        label="下一题"
        @click="$emit('next')"
      />
      <q-btn
        v-else
        color="positive"
        icon-right="check"
        label="提交"
        @click="handleSubmit"
      />
    </div>

    <!-- 提交确认对话框 -->
    <q-dialog v-model="showConfirmDialog" aria-labelledby="submit-confirm-title">
      <q-card>
        <q-card-section>
          <div id="submit-confirm-title" class="text-h6">确认提交</div>
        </q-card-section>
        <q-card-section>
          确定要提交问卷吗？提交后将无法修改答案。
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup />
          <q-btn flat label="确认提交" color="primary" @click="confirmSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isFirst: boolean;
  isLast: boolean;
  canSubmit: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  next: [];
  submit: [];
  'goto-unanswered': [];
}>();

const showConfirmDialog = ref(false);

function handleSubmit() {
  if (!props.canSubmit) {
    emit('submit');
    return;
  }
  showConfirmDialog.value = true;
}

function confirmSubmit() {
  showConfirmDialog.value = false;
  emit('submit');
}
</script>

<style scoped lang="scss">
.navigation-buttons {
  position: sticky;
  bottom: 0;
  z-index: 200;
  background: white;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
