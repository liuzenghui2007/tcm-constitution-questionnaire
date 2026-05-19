<template>
  <div class="progress-bar-container">
    <q-linear-progress
      role="progressbar"
      :value="progress"
      color="primary"
      track-color="grey-3"
      size="8px"
      rounded
      :aria-valuenow="Math.round(progress * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`问卷填写进度 ${Math.round(progress * 100)}%，第 ${current} 题，共 ${total} 题`"
    />
    <div class="text-caption text-center q-mt-xs text-grey-7" aria-hidden="true">
      第 {{ current }} 题 / 共 {{ total }} 题
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number;
  current: number;
  total: number;
}>();
</script>

<style scoped lang="scss">
.progress-bar-container {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 16px 8px;
}
</style>
