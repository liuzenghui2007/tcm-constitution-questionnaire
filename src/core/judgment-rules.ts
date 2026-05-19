import type { JudgmentResult } from 'src/types/constitution';

/**
 * 判定偏颇体质
 * - 转化分 ≥ 40：是
 * - 转化分 30~39：倾向是
 * - 转化分 < 30：否
 * @param transformedScore 转化分
 * @returns 判定结果
 */
export function judgeBiasedConstitution(
  transformedScore: number,
): JudgmentResult {
  if (transformedScore >= 40) return '是';
  if (transformedScore >= 30) return '倾向是';
  return '否';
}

/**
 * 判定平和质
 * - 转化分 ≥ 60 且其他8种体质转化分均 < 30：是
 * - 转化分 ≥ 60 且其他8种体质转化分均 < 40：基本是
 * - 不满足以上条件：否
 * @param pingheScore 平和质转化分
 * @param otherScores 其他8种体质的转化分数组
 * @returns 判定结果
 */
export function judgeBalancedConstitution(
  pingheScore: number,
  otherScores: number[],
): JudgmentResult {
  if (pingheScore >= 60 && otherScores.every((s) => s < 30)) return '是';
  if (pingheScore >= 60 && otherScores.every((s) => s < 40)) return '基本是';
  return '否';
}
