<template>
  <div class="gender-selector" role="radiogroup" aria-label="请选择您的性别">
    <div class="text-subtitle1 text-center q-mb-md">请选择您的性别</div>
    <div class="row q-gutter-md justify-center">
      <q-card
        class="gender-card cursor-pointer"
        :class="{ 'gender-card--selected': modelValue === 'male' }"
        @click="select('male')"
        tabindex="0"
        role="radio"
        :aria-checked="modelValue === 'male'"
        aria-label="男性"
        @keydown.enter="select('male')"
        @keydown.space.prevent="select('male')"
      >
        <q-card-section class="text-center">
          <q-icon name="male" size="48px" color="blue" />
          <div class="text-h6 q-mt-sm">男性</div>
        </q-card-section>
      </q-card>

      <q-card
        class="gender-card cursor-pointer"
        :class="{ 'gender-card--selected': modelValue === 'female' }"
        @click="select('female')"
        tabindex="0"
        role="radio"
        :aria-checked="modelValue === 'female'"
        aria-label="女性"
        @keydown.enter="select('female')"
        @keydown.space.prevent="select('female')"
      >
        <q-card-section class="text-center">
          <q-icon name="female" size="48px" color="pink" />
          <div class="text-h6 q-mt-sm">女性</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Gender } from 'src/types/constitution';

defineProps<{
  modelValue: Gender | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Gender];
}>();

function select(gender: Gender) {
  emit('update:modelValue', gender);
}
</script>

<style scoped lang="scss">
.gender-card {
  min-width: 120px;
  min-height: 120px;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &--selected {
    border-color: $primary;
    background-color: rgba($primary, 0.05);
  }
}
</style>
