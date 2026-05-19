import type { QuizState } from 'src/types/constitution';

const STORAGE_KEY = 'tcm-quiz-state';

export function useLocalStorage() {
  function saveState(state: QuizState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage 不可用时静默失败
    }
  }

  function loadState(): QuizState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as QuizState) : null;
    } catch {
      return null;
    }
  }

  function clearState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage 不可用时静默失败
    }
  }

  return { saveState, loadState, clearState };
}
