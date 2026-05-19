import { describe, it, expect } from 'vitest';
import type { QuestionnaireData } from 'src/types/constitution';
import questionnaireData from 'src/data/questions.json';

const data = questionnaireData as QuestionnaireData;

/**
 * 数据层核对：`questions.json` 与 GB/T 46939—2025 附录 A（表 A.1～A.9）一致性的结构校验。
 */
describe('questions.json 数据完整性（附录 A 对齐版）', () => {
  const qMap = new Map(data.questions.map((q) => [q.id, q]));
  const allIds = new Set(data.questions.map((q) => q.id));

  it('全表 27 道展示题（含性别专属），九种体质配置齐全', () => {
    expect(data.questions).toHaveLength(27);
    expect(data.constitutions).toHaveLength(9);
  });

  it('所有体质计分条目的 questionId 均存在于 questions 列表', () => {
    for (const c of data.constitutions) {
      for (const item of c.items) {
        expect(allIds.has(item.questionId), `${c.id} 引用无效 id: ${item.questionId}`).toBe(
          true,
        );
      }
    }
  });

  it('五级量表文案为 没有/很少/有时/经常/总是', () => {
    expect(data.scaleOptions.map((o) => o.label).join(',')).toBe(
      '没有,很少,有时,经常,总是',
    );
  });

  it('湿热质含性别专属题 q17 女 / q18 男（表 A.6）', () => {
    const shire = data.constitutions.find((c) => c.id === 'shire');
    expect(shire).toBeDefined();
    const ids = shire!.items.map((i) => i.questionId);
    expect(ids).toContain('q17');
    expect(ids).toContain('q18');
    expect(qMap.get('q17')?.gender).toBe('female');
    expect(qMap.get('q18')?.gender).toBe('male');
  });

  it('平和质表 A.1：4 条，仅 q1 正向，q2/q3/q4 带 * 逆向', () => {
    const pinghe = data.constitutions.find((c) => c.id === 'pinghe');
    expect(pinghe?.items).toHaveLength(4);
    expect(pinghe!.items.filter((i) => !i.reverse).map((i) => i.questionId)).toEqual(['q1']);
    expect(pinghe!.items.filter((i) => i.reverse).map((i) => i.questionId).sort()).toEqual(
      ['q2', 'q3', 'q4'].sort(),
    );
  });

  it('气虚质表 A.2：疲乏、气短、心慌（q2,q5,q6）', () => {
    const qixu = data.constitutions.find((c) => c.id === 'qixu');
    expect(qixu?.items.map((i) => i.questionId)).toEqual(['q2', 'q5', 'q6']);
    expect(qixu!.items.every((i) => !i.reverse)).toBe(true);
  });

  it('阳虚质表 A.3：胃脘背腰怕冷、穿衣怕冷、不耐寒（q7,q8,q4）', () => {
    const yangxu = data.constitutions.find((c) => c.id === 'yangxu');
    expect(yangxu?.items.map((i) => i.questionId).sort()).toEqual(['q4', 'q7', 'q8'].sort());
  });

  it('特禀质表 A.9：4 条（q24～q27）', () => {
    const tebing = data.constitutions.find((c) => c.id === 'tebing');
    expect(tebing?.items.map((i) => i.questionId)).toEqual(['q24', 'q25', 'q26', 'q27']);
  });

  it('阴虚、痰湿、血瘀、气郁各 3 条；偏颇条目均为正向计分', () => {
    for (const id of ['yinxu', 'tanshi', 'xueyu', 'qiyu'] as const) {
      const c = data.constitutions.find((x) => x.id === id);
      expect(c?.items).toHaveLength(3);
      expect(c!.items.every((i) => !i.reverse)).toBe(true);
    }
  });

  it('气虚、阳虚各 3 条；湿热、特禀各 4 条；偏颇条目均为正向', () => {
    for (const id of ['qixu', 'yangxu'] as const) {
      const c = data.constitutions.find((x) => x.id === id);
      expect(c?.items).toHaveLength(3);
      expect(c!.items.every((i) => !i.reverse)).toBe(true);
    }
    for (const id of ['shire', 'tebing'] as const) {
      const c = data.constitutions.find((x) => x.id === id);
      expect(c?.items).toHaveLength(4);
      expect(c!.items.every((i) => !i.reverse)).toBe(true);
    }
  });
});
