import { describe, it, expect } from 'vitest';
import { evaluateConstitution } from 'src/core/constitution-engine';
import type { QuestionnaireData } from 'src/types/constitution';

// 简化的测试数据
const testData: QuestionnaireData = {
  version: 'test',
  scaleOptions: [],
  questions: [
    { id: 'q1', text: '精力充沛', gender: 'all' },
    { id: 'q2', text: '容易疲乏', gender: 'all' },
    { id: 'q3', text: '气短', gender: 'all' },
    { id: 'q4', text: '声音低弱', gender: 'all' },
    { id: 'q5', text: '女性题目', gender: 'female' },
    { id: 'q6', text: '男性题目', gender: 'male' },
  ],
  constitutions: [
    {
      id: 'pinghe',
      name: '平和质',
      type: 'balanced',
      items: [
        { questionId: 'q1', reverse: false },
        { questionId: 'q2', reverse: true },
      ],
    },
    {
      id: 'qixu',
      name: '气虚质',
      type: 'biased',
      items: [
        { questionId: 'q2', reverse: false },
        { questionId: 'q3', reverse: false },
        { questionId: 'q4', reverse: false },
      ],
    },
    {
      id: 'shire',
      name: '湿热质',
      type: 'biased',
      items: [
        { questionId: 'q5', reverse: false },
        { questionId: 'q6', reverse: false },
      ],
    },
  ],
};

describe('evaluateConstitution', () => {
  it('returns results for all constitutions', () => {
    const answers = { q1: 5, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1 };
    const results = evaluateConstitution(answers, testData, 'male');
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.constitutionId)).toEqual([
      'pinghe',
      'qixu',
      'shire',
    ]);
  });

  it('calculates correct transformed scores', () => {
    // 平和质: q1=5(正向), q2=1(逆向→5) => rawScore=10, itemCount=2
    // 转化分 = (10-2)/(2*4)*100 = 100
    const answers = { q1: 5, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1 };
    const results = evaluateConstitution(answers, testData, 'male');
    const pinghe = results.find((r) => r.constitutionId === 'pinghe');
    expect(pinghe?.transformedScore).toBe(100);
  });

  it('judges balanced constitution correctly when all biased are low', () => {
    // 平和质高分，偏颇体质低分 => 平和质判定为"是"
    const answers = { q1: 5, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1 };
    const results = evaluateConstitution(answers, testData, 'male');
    const pinghe = results.find((r) => r.constitutionId === 'pinghe');
    expect(pinghe?.judgment).toBe('是');
  });

  // Property 4: 男性答案中不包含女性专属条目的计分
  it('male user: shire constitution only includes male question', () => {
    const answers = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 5, q6: 5 };
    const results = evaluateConstitution(answers, testData, 'male');
    const shire = results.find((r) => r.constitutionId === 'shire');
    // 男性只有 q6，itemCount=1, rawScore=5
    expect(shire?.itemCount).toBe(1);
    expect(shire?.rawScore).toBe(5);
    expect(shire?.transformedScore).toBe(100); // (5-1)/(1*4)*100 = 100
  });

  // Property 4: 女性答案中不包含男性专属条目的计分
  it('female user: shire constitution only includes female question', () => {
    const answers = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 5, q6: 5 };
    const results = evaluateConstitution(answers, testData, 'female');
    const shire = results.find((r) => r.constitutionId === 'shire');
    // 女性只有 q5，itemCount=1, rawScore=5
    expect(shire?.itemCount).toBe(1);
    expect(shire?.rawScore).toBe(5);
    expect(shire?.transformedScore).toBe(100);
  });

  it('biased constitution with high score is judged as "是"', () => {
    // 气虚质: q2=5, q3=5, q4=5 => rawScore=15, itemCount=3
    // 转化分 = (15-3)/(3*4)*100 = 100
    const answers = { q1: 1, q2: 5, q3: 5, q4: 5, q5: 1, q6: 1 };
    const results = evaluateConstitution(answers, testData, 'male');
    const qixu = results.find((r) => r.constitutionId === 'qixu');
    expect(qixu?.transformedScore).toBe(100);
    expect(qixu?.judgment).toBe('是');
  });

  it('biased constitution with low score is judged as "否"', () => {
    // 气虚质: q2=1, q3=1, q4=1 => rawScore=3, itemCount=3
    // 转化分 = (3-3)/(3*4)*100 = 0
    const answers = { q1: 5, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1 };
    const results = evaluateConstitution(answers, testData, 'male');
    const qixu = results.find((r) => r.constitutionId === 'qixu');
    expect(qixu?.transformedScore).toBe(0);
    expect(qixu?.judgment).toBe('否');
  });
});
