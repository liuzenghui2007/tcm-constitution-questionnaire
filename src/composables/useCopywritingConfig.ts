import { readonly, ref } from 'vue';
import type { CopywritingMode } from 'src/types/constitution';
import appConfig from 'src/config/app-config';

const VALID_MODES: CopywritingMode[] = ['concise', 'detailed'];

export function resolveMode(value: unknown): CopywritingMode {
  if (typeof value === 'string' && VALID_MODES.includes(value as CopywritingMode)) {
    return value as CopywritingMode;
  }
  return 'concise';
}

export function useCopywritingConfig() {
  const mode = ref<CopywritingMode>(resolveMode(appConfig.copywritingMode));
  return {
    mode: readonly(mode),
  };
}
