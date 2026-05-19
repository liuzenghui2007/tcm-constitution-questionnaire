import type {
  Gender,
  QuestionnaireData,
  ScoreResult,
} from 'src/types/constitution';
import { calculateRawScore, calculateTransformedScore } from './score-calculator';
import { judgeBiasedConstitution, judgeBalancedConstitution } from './judgment-rules';

/**
 * 执行完整的体质判定流程
 * @param answers 所有答案 Record<questionId, value>
 * @param questionnaireData 问卷配置数据
 * @param gender 用户性别
 * @returns 所有体质的评分和判定结果
 */
export function evaluateConstitution(
  answers: Record<string, number>,
  questionnaireData: QuestionnaireData,
  gender: Gender,
): ScoreResult[] {
  const { questions, constitutions } = questionnaireData;

  // 1. 计算每种体质的原始分和转化分
  const scoreResults: ScoreResult[] = constitutions.map((constitution) => {
    const { rawScore, itemCount } = calculateRawScore(
      answers,
      constitution.items,
      questions,
      gender,
    );
    const transformedScore = calculateTransformedScore(rawScore, itemCount);

    return {
      constitutionId: constitution.id,
      constitutionName: constitution.name,
      rawScore,
      transformedScore,
      itemCount,
      judgment: '否' as const, // 先占位，后面再判定
    };
  });

  // 2. 找到平和质和偏颇体质
  const pingheResult = scoreResults.find((r) => r.constitutionId === 'pinghe');
  const biasedResults = scoreResults.filter(
    (r) => r.constitutionId !== 'pinghe',
  );

  // 3. 判定偏颇体质
  for (const result of biasedResults) {
    result.judgment = judgeBiasedConstitution(result.transformedScore);
  }

  // 4. 判定平和质（依赖偏颇体质的转化分）
  if (pingheResult) {
    const otherScores = biasedResults.map((r) => r.transformedScore);
    pingheResult.judgment = judgeBalancedConstitution(
      pingheResult.transformedScore,
      otherScores,
    );
  }

  return scoreResults;
}
