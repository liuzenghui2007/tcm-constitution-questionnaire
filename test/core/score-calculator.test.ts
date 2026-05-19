import { describe, it, expect } from 'vitest';
import { test as fcTest } from '@fast-check/vitest';
import fc from 'fast-check';
import {
  reverseScore,
  calculateTransformedScore,
  calculateRawScore,
} from 'src/core/score-calculator';
import type { ConstitutionItem, Question } from 'src/types/constitution';

describe('reverseScore', () => {
  // Property 2: reverseScore(v) === 6 - v
  fcTest.prop([fc.integer({ min: 1, max: 5 })])(
    'reverse of v equals 6-v',
    (v) => {
      expect(reverseScore(v)).toBe(6 - v);
    },
  );

  it('reverseScore(1) = 5', () => {
    expect(reverseScore(1)).toBe(5);
  });

  it('reverseScore(5) = 1', () => {
    expect(reverseScore(5)).toBe(1);
  });

  it('reverseScore(3) = 3', () => {
    expect(reverseScore(3)).toBe(3);
  });
});

describe('calculateTransformedScore', () => {
  // Property 1: 所有条目选1分时转化分 = 0
  it('all minimum scores (1) yield transformed score = 0', () => {
    const itemCount = 4;
    const rawScore = itemCount * 1; // 所有选1
    expect(calculateTransformedScore(rawScore, itemCount)).toBe(0);
  });

  // Property 1: 所有条目选5分时转化分 = 100
  it('all maximum scores (5) yield transformed score = 100', () => {
    const itemCount = 4;
    const rawScore = itemCount * 5; // 所有选5
    expect(calculateTransformedScore(rawScore, itemCount)).toBe(100);
  });

  // Property 1: 任意有效评分组合，转化分 ∈ [0, 100]
  fcTest.prop([fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 1, maxLength: 10 })])(
    'transformed score is always in [0, 100] for valid inputs',
    (scores) => {
      const rawScore = scores.reduce((a: number, b: number) => a + b, 0);
      const result = calculateTransformedScore(rawScore, scores.length);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    },
  );

  it('handles itemCount = 0 gracefully', () => {
    expect(calculateTransformedScore(0, 0)).toBe(0);
  });
});

describe('calculateRawScore', () => {
  const questions: Question[] = [
    { id: 'q1', text: '题目1', gender: 'all' },
    { id: 'q2', text: '题目2', gender: 'all' },
    { id: 'q3', text: '女性题目', gender: 'female' },
    { id: 'q4', text: '男性题目', gender: 'male' },
  ];

  it('calculates raw score correctly without reverse', () => {
    const items: ConstitutionItem[] = [
      { questionId: 'q1', reverse: false },
      { questionId: 'q2', reverse: false },
    ];
    const answers = { q1: 3, q2: 4 };
    const result = calculateRawScore(answers, items, questions, 'male');
    expect(result.rawScore).toBe(7);
    expect(result.itemCount).toBe(2);
  });

  it('calculates raw score correctly with reverse', () => {
    const items: ConstitutionItem[] = [
      { questionId: 'q1', reverse: true },
      { questionId: 'q2', reverse: false },
    ];
    const answers = { q1: 2, q2: 4 };
    const result = calculateRawScore(answers, items, questions, 'male');
    // q1 reverse: 6-2=4, q2: 4 => total = 8
    expect(result.rawScore).toBe(8);
    expect(result.itemCount).toBe(2);
  });

  // Property 4: 男性答案中不包含女性专属条目的计分
  it('male user does not include female-only questions', () => {
    const items: ConstitutionItem[] = [
      { questionId: 'q1', reverse: false },
      { questionId: 'q3', reverse: false }, // female only
      { questionId: 'q4', reverse: false }, // male only
    ];
    const answers = { q1: 3, q3: 5, q4: 4 };
    const result = calculateRawScore(answers, items, questions, 'male');
    expect(result.itemCount).toBe(2); // q1 + q4
    expect(result.rawScore).toBe(7); // 3 + 4
  });

  // Property 4: 女性答案中不包含男性专属条目的计分
  it('female user does not include male-only questions', () => {
    const items: ConstitutionItem[] = [
      { questionId: 'q1', reverse: false },
      { questionId: 'q3', reverse: false }, // female only
      { questionId: 'q4', reverse: false }, // male only
    ];
    const answers = { q1: 3, q3: 5, q4: 4 };
    const result = calculateRawScore(answers, items, questions, 'female');
    expect(result.itemCount).toBe(2); // q1 + q3
    expect(result.rawScore).toBe(8); // 3 + 5
  });
});
