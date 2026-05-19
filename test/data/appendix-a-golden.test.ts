import { describe, it, expect } from 'vitest';
import { evaluateConstitution } from 'src/core/constitution-engine';
import type { QuestionnaireData } from 'src/types/constitution';
import questionnaireData from 'src/data/questions.json';

const data = questionnaireData as QuestionnaireData;

describe('附录 A 对齐数据：引擎黄金算例', () => {
  it('每题均选 5：平和转化分 25、判定否；八种偏颇均为 100、判定是', () => {
    const answers = Object.fromEntries(
      data.questions.map((q) => [q.id, 5]),
    ) as Record<string, number>;
    for (const g of ['male', 'female'] as const) {
      const results = evaluateConstitution(answers, data, g);
      const pinghe = results.find((r) => r.constitutionId === 'pinghe');
      expect(pinghe?.rawScore).toBe(8);
      expect(pinghe?.itemCount).toBe(4);
      expect(pinghe?.transformedScore).toBe(25);
      expect(pinghe?.judgment).toBe('否');

      const biased = results.filter((r) => r.constitutionId !== 'pinghe');
      expect(biased).toHaveLength(8);
      for (const r of biased) {
        expect(r.transformedScore).toBe(100);
        expect(r.judgment).toBe('是');
      }
    }
  });
});
