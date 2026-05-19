import { describe, it, expect } from 'vitest';
import { test as fcTest } from '@fast-check/vitest';
import fc from 'fast-check';
import {
  judgeBiasedConstitution,
  judgeBalancedConstitution,
} from 'src/core/judgment-rules';

describe('judgeBiasedConstitution', () => {
  // Property 3: 结果必为"是"/"倾向是"/"否"之一
  fcTest.prop([fc.float({ min: 0, max: 100, noNaN: true })])(
    'result is exactly one of three valid values',
    (score) => {
      const result = judgeBiasedConstitution(score);
      expect(['是', '倾向是', '否']).toContain(result);
    },
  );

  // 边界值测试
  it('score 40 => "是"', () => {
    expect(judgeBiasedConstitution(40)).toBe('是');
  });

  it('score 39 => "倾向是"', () => {
    expect(judgeBiasedConstitution(39)).toBe('倾向是');
  });

  it('score 30 => "倾向是"', () => {
    expect(judgeBiasedConstitution(30)).toBe('倾向是');
  });

  it('score 29 => "否"', () => {
    expect(judgeBiasedConstitution(29)).toBe('否');
  });

  it('score 100 => "是"', () => {
    expect(judgeBiasedConstitution(100)).toBe('是');
  });

  it('score 0 => "否"', () => {
    expect(judgeBiasedConstitution(0)).toBe('否');
  });
});

describe('judgeBalancedConstitution', () => {
  // Property 3: 结果必为"是"/"基本是"/"否"之一
  fcTest.prop([
    fc.float({ min: 0, max: 100, noNaN: true }),
    fc.array(fc.float({ min: 0, max: 100, noNaN: true }), { minLength: 8, maxLength: 8 }),
  ])(
    'result is exactly one of three valid values',
    (pingheScore, otherScores) => {
      const result = judgeBalancedConstitution(pingheScore, otherScores);
      expect(['是', '基本是', '否']).toContain(result);
    },
  );

  // 边界值测试
  it('pinghe=60, all others<30 => "是"', () => {
    const otherScores = [20, 25, 10, 15, 29, 0, 5, 28];
    expect(judgeBalancedConstitution(60, otherScores)).toBe('是');
  });

  it('pinghe=60, all others<40 but some>=30 => "基本是"', () => {
    const otherScores = [20, 35, 10, 15, 30, 0, 5, 28];
    expect(judgeBalancedConstitution(60, otherScores)).toBe('基本是');
  });

  it('pinghe=60, some other>=40 => "否"', () => {
    const otherScores = [20, 40, 10, 15, 29, 0, 5, 28];
    expect(judgeBalancedConstitution(60, otherScores)).toBe('否');
  });

  it('pinghe=59, all others<30 => "否"', () => {
    const otherScores = [20, 25, 10, 15, 29, 0, 5, 28];
    expect(judgeBalancedConstitution(59, otherScores)).toBe('否');
  });

  it('pinghe=100, all others=0 => "是"', () => {
    const otherScores = [0, 0, 0, 0, 0, 0, 0, 0];
    expect(judgeBalancedConstitution(100, otherScores)).toBe('是');
  });
});
