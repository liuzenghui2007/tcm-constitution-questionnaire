<template>
  <div
    class="scale-radio-group"
    role="radiogroup"
    :aria-labelledby="ariaLabelledby || undefined"
    :aria-label="ariaLabelledby ? undefined : '评分选项'"
  >
    <div class="scale-options" :class="{ 'scale-options--vertical': isVertical }">
      <label
        v-for="option in options"
        :key="option.value"
        class="scale-option"
        :class="{ 'scale-option--selected': modelValue === option.value }"
      >
        <q-radio
          :model-value="modelValue"
          :val="option.value"
          :label="option.label"
          :aria-describedby="describedById(option.value)"
          @update:model-value="$emit('update:modelValue', $event)"
          color="primary"
        />
        <span
          class="scale-option__desc text-caption text-grey-6"
          :id="describedById(option.value)"
        >{{ option.description }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import type { ScaleOption } from 'src/types/constitution';

const props = defineProps<{
  options: ScaleOption[];
  modelValue: number | undefined;
  /** 关联题目标题元素的 id，用于屏幕阅读器 */
  ariaLabelledby?: string;
}>();

defineEmits<{
  'update:modelValue': [value: number];
}>();

const $q = useQuasar();
const isVertical = computed(() => $q.screen.lt.sm);

function describedById(value: number): string {
  const base = props.ariaLabelledby ?? 'scale-option';
  return `${base}-desc-${value}`;
}
</script>

<style scoped lang="scss">
.scale-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &--vertical {
    flex-direction: column;
  }
}

.scale-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &--selected {
    background-color: rgba($primary, 0.08);
  }

  &__desc {
    margin-left: 28px;
  }
}
</style>
