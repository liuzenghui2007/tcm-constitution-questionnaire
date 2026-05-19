import type {
  ConstitutionItem,
  Gender,
  Question,
} from 'src/types/constitution';

/**
 * 逆向计分
 * @param value 原始选择值 (1-5)
 * @returns 逆向后的值 (6 - value)
 */
export function reverseScore(value: number): number {
  return 6 - value;
}

/**
 * 计算转化分
 * 公式：[(原始分 - 条目数) / (条目数 × 4)] × 100
 * @param rawScore 原始分（各条目分值之和）
 * @param itemCount 条目数量
 * @returns 转化分 (0-100)
 */
export function calculateTransformedScore(
  rawScore: number,
  itemCount: number,
): number {
  if (itemCount === 0) return 0;
  return ((rawScore - itemCount) / (itemCount * 4)) * 100;
}

/**
 * 计算某种体质的原始分（共享答案模式）
 * @param answers 用户答案 Record<questionId, value>
 * @param items 该体质的计分条目映射
 * @param questions 全部展示题目（用于性别过滤）
 * @param gender 用户性别
 * @returns { rawScore, itemCount }
 */
export function calculateRawScore(
  answers: Record<string, number>,
  items: ConstitutionItem[],
  questions: Question[],
  gender: Gender,
): { rawScore: number; itemCount: number } {
  // 构建 questionId -> Question 的查找表
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // 过滤掉不适用当前性别的条目
  const filteredItems = items.filter((item) => {
    const question = questionMap.get(item.questionId);
    return (
      question && (question.gender === 'all' || question.gender === gender)
    );
  });

  let rawScore = 0;
  for (const item of filteredItems) {
    const value = answers[item.questionId];
    if (value !== undefined) {
      rawScore += item.reverse ? reverseScore(value) : value;
    }
  }

  return { rawScore, itemCount: filteredItems.length };
}
