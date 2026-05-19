import { ref, computed } from 'vue';
import type { Gender, Question, QuizState } from 'src/types/constitution';
import questionnaireData from 'src/data/questions.json';
import { useLocalStorage } from './useLocalStorage';

const { saveState, loadState, clearState } = useLocalStorage();

// 全局响应式状态
const gender = ref<Gender | null>(null);
const answers = ref<Record<string, number>>({});
const currentPage = ref(0);
const completed = ref(false);

export function useQuestionnaire() {
  /**
   * 根据性别过滤展示题目列表
   */
  function getFilteredQuestions(g: Gender): Question[] {
    return (questionnaireData.questions as Question[]).filter(
      (q) => q.gender === 'all' || q.gender === g,
    );
  }

  /**
   * 当前性别下的题目列表
   */
  const filteredQuestions = computed(() => {
    if (!gender.value) return questionnaireData.questions as Question[];
    return getFilteredQuestions(gender.value);
  });

  /**
   * 设置答案并自动保存到 localStorage
   */
  function setAnswer(questionId: string, value: number): void {
    answers.value[questionId] = value;
    persistState();
  }

  /**
   * 已回答题目数 / 总题目数
   */
  const progress = computed(() => {
    const total = filteredQuestions.value.length;
    if (total === 0) return 0;
    const answered = filteredQuestions.value.filter(
      (q) => answers.value[q.id] !== undefined,
    ).length;
    return answered / total;
  });

  /**
   * 所有题目已回答
   */
  const canSubmit = computed(() => {
    return filteredQuestions.value.every(
      (q) => answers.value[q.id] !== undefined,
    );
  });

  /**
   * 未回答题目列表
   */
  const unansweredQuestions = computed(() => {
    return filteredQuestions.value.filter(
      (q) => answers.value[q.id] === undefined,
    );
  });

  /**
   * 设置性别
   */
  function setGender(g: Gender): void {
    gender.value = g;
    persistState();
  }

  /**
   * 设置当前页码
   */
  function setCurrentPage(page: number): void {
    currentPage.value = page;
    persistState();
  }

  /**
   * 标记为已完成
   */
  function setCompleted(value: boolean): void {
    completed.value = value;
    persistState();
  }

  /**
   * 持久化状态到 localStorage
   */
  function persistState(): void {
    const state: QuizState = {
      gender: gender.value,
      answers: answers.value,
      currentPage: currentPage.value,
      completed: completed.value,
    };
    saveState(state);
  }

  /**
   * 从 localStorage 恢复状态
   */
  function restoreState(): boolean {
    const state = loadState();
    if (state && !state.completed) {
      gender.value = state.gender;
      answers.value = state.answers || {};
      currentPage.value = state.currentPage || 0;
      completed.value = state.completed || false;
      return true;
    }
    return false;
  }

  /**
   * 重置所有状态
   */
  function resetState(): void {
    gender.value = null;
    answers.value = {};
    currentPage.value = 0;
    completed.value = false;
    clearState();
  }

  /**
   * 检查是否有未完成的状态
   */
  function hasSavedState(): boolean {
    const state = loadState();
    return state !== null && !state.completed;
  }

  return {
    // 状态
    gender,
    answers,
    currentPage,
    completed,
    // 计算属性
    filteredQuestions,
    progress,
    canSubmit,
    unansweredQuestions,
    // 方法
    setGender,
    setAnswer,
    setCurrentPage,
    setCompleted,
    restoreState,
    resetState,
    hasSavedState,
    getFilteredQuestions,
  };
}
