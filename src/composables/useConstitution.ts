import { ref } from 'vue';
import type {
  ConstitutionInfo,
  DetailedConstitutionInfo,
  Gender,
  ScoreResult,
} from 'src/types/constitution';
import { evaluateConstitution } from 'src/core/constitution-engine';
import questionnaireData from 'src/data/questions.json';
import constitutionsData from 'src/data/constitutions.json';
import detailedData from 'src/data/constitutions-detailed.json';
import type { QuestionnaireData } from 'src/types/constitution';
import { useCopywritingConfig } from 'src/composables/useCopywritingConfig';
import { validateDetailedData } from 'src/utils/validate-detailed-data';

// Validate detailed data at load time
validateDetailedData(detailedData.constitutions);

const results = ref<ScoreResult[]>([]);

export function useConstitution() {
  const { mode } = useCopywritingConfig();

  /**
   * 调用 constitution-engine 计算结果
   */
  function evaluate(answers: Record<string, number>, gender: Gender): ScoreResult[] {
    const data = questionnaireData as unknown as QuestionnaireData;
    const scoreResults = evaluateConstitution(answers, data, gender);
    results.value = scoreResults;
    return scoreResults;
  }

  /**
   * 获取体质详细特征（简洁版）
   */
  function getConstitutionInfo(id: string): ConstitutionInfo | undefined {
    return (constitutionsData.constitutions as ConstitutionInfo[]).find((c) => c.id === id);
  }

  /**
   * 获取体质详细信息（详细版）
   */
  function getDetailedConstitutionInfo(id: string): DetailedConstitutionInfo | undefined {
    return (detailedData.constitutions as unknown as DetailedConstitutionInfo[]).find(
      (c) => c.id === id,
    );
  }

  return {
    results,
    mode,
    evaluate,
    getConstitutionInfo,
    getDetailedConstitutionInfo,
  };
}
