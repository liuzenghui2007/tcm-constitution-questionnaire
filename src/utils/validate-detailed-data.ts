import type { DetailedConstitutionInfo, ConstitutionId } from 'src/types/constitution';

const VALID_IDS: ConstitutionId[] = [
  'pinghe',
  'qixu',
  'yangxu',
  'yinxu',
  'tanshi',
  'shire',
  'xueyu',
  'qiyu',
  'tebing',
];

export function validateDetailedData(entries: unknown[]): DetailedConstitutionInfo[] {
  if (entries.length !== 9) {
    throw new Error(`Expected 9 constitution entries, got ${entries.length}`);
  }

  for (const entry of entries) {
    const e = entry as Record<string, unknown>;
    const id = typeof e.id === 'string' ? e.id : '';
    if (!id || !VALID_IDS.includes(id as ConstitutionId)) {
      throw new Error(`Invalid or missing constitution id: "${String(e.id)}"`);
    }
    // 验证必填字段非空
    for (const field of [
      'name',
      'description',
      'dietaryAdvice',
      'recommendedFoods',
      'avoidFoods',
    ]) {
      const value = e[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        throw new Error(`Constitution "${id}": field "${field}" is empty or missing`);
      }
    }
    if (!Array.isArray(e.causes) || e.causes.length === 0) {
      throw new Error(`Constitution "${id}": "causes" must be a non-empty array`);
    }
    if (!Array.isArray(e.medicinalRecipes) || e.medicinalRecipes.length === 0) {
      throw new Error(`Constitution "${id}": "medicinalRecipes" must be a non-empty array`);
    }
  }

  return entries as DetailedConstitutionInfo[];
}
