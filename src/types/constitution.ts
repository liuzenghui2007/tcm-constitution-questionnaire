/** 性别类型 */
export type Gender = 'male' | 'female';

/** 体质分类：平和质 或 偏颇体质 */
export type ConstitutionType = 'balanced' | 'biased';

/** 判定结果 */
export type JudgmentResult = '是' | '基本是' | '倾向是' | '否';

/** 5级评分选项 */
export interface ScaleOption {
  value: number; // 1-5
  label: string; // 没有/很少/有时/经常/总是
  description: string; // 根本不/有一点/有些/相当/非常
}

/** 展示给用户的去重题目 */
export interface Question {
  id: string;
  text: string;
  gender: 'all' | 'male' | 'female';
}

/** 体质计分条目：引用题目 + 计分方式 */
export interface ConstitutionItem {
  questionId: string; // 引用 questions[].id
  reverse: boolean; // 该体质下是否逆向计分
}

/** 体质配置 */
export interface ConstitutionConfig {
  id: string;
  name: string;
  type: ConstitutionType;
  items: ConstitutionItem[];
}

/** 问卷数据总结构 */
export interface QuestionnaireData {
  version: string;
  scaleOptions: ScaleOption[];
  questions: Question[];
  constitutions: ConstitutionConfig[];
}

/** 体质详细特征信息 */
export interface ConstitutionInfo {
  id: string;
  name: string;
  mainFeature: string;
  bodyFeature: string;
  commonSymptoms: string;
  psychFeature: string;
  diseaseRisk: string;
  envAdaptation: string;
}

/** 单个体质的评分结果 */
export interface ScoreResult {
  constitutionId: string;
  constitutionName: string;
  rawScore: number;
  transformedScore: number;
  itemCount: number;
  judgment: JudgmentResult;
}

/** 问卷填写状态（用于本地存储） */
export interface QuizState {
  gender: Gender | null;
  answers: Record<string, number>; // key = question.id, value = 1-5
  currentPage: number;
  completed: boolean;
}

/** 9种体质标识符联合类型 */
export type ConstitutionId =
  | 'pinghe'
  | 'qixu'
  | 'yangxu'
  | 'yinxu'
  | 'tanshi'
  | 'shire'
  | 'xueyu'
  | 'qiyu'
  | 'tebing';

/** 文案模式 */
export type CopywritingMode = 'concise' | 'detailed';

/** 药膳方 */
export interface MedicinalRecipe {
  name: string;
  preparation: string;
}

/** 详细版体质信息 */
export interface DetailedConstitutionInfo {
  id: ConstitutionId;
  name: string;
  description: string;
  causes: string[]; // 至少1个元素
  dietaryAdvice: string;
  recommendedFoods: string;
  avoidFoods: string;
  medicinalRecipes: MedicinalRecipe[]; // 至少1个元素
}
