/** 文案模式：concise=简洁版，detailed=详细版 */
export type CopywritingMode = 'concise' | 'detailed';

/** 问卷显示模式：single=每题单独显示，all=一页显示所有题目 */
export type QuizDisplayMode = 'single' | 'all';

export interface AppConfig {
  copywritingMode: CopywritingMode;
  quizDisplayMode: QuizDisplayMode;
}

// export type CopywritingMode = 'concise' | 'detailed';

const appConfig: AppConfig = {
  copywritingMode: 'detailed', // 可选值：'concise' | 'detailed'
  quizDisplayMode: 'all', // 可选值：'single' | 'all'
};

export default appConfig;
