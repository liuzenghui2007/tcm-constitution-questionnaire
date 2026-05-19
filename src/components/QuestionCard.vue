<template>
  <q-card class="question-card q-mb-md" :class="{ 'question-card--unanswered': modelValue === undefined }">
    <q-card-section>
      <div class="text-subtitle1 q-mb-md" :id="questionHeadingId">
        <span class="text-weight-bold">{{ questionIndex }}.</span>
        {{ question.text }}
      </div>
      <ScaleRadioGroup
        :options="scaleOptions"
        :model-value="modelValue"
        :aria-labelledby="questionHeadingId"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Question, ScaleOption } from 'src/types/constitution';
import ScaleRadioGroup from './ScaleRadioGroup.vue';
import questionnaireData from 'src/data/questions.json';

const props = defineProps<{
  question: Question;
  questionIndex: number;
  modelValue: number | undefined;
}>();

defineEmits<{
  'update:modelValue': [value: number];
}>();

const scaleOptions = questionnaireData.scaleOptions as ScaleOption[];

const questionHeadingId = computed(
  () => `question-heading-${props.question.id}`,
);
</script>

<style scoped lang="scss">
.question-card {
  &--unanswered {
    border: 2px solid $warning;
  }
}
</style>
