# Implementation Plan: Configurable Constitution Copywriting

## Overview

实现体质文案可配置切换功能，将 DAQ 旧版项目中 9 种体质的详细养生建议文案迁移到 TCM 项目，并提供构建时配置开关在"简洁版"和"详细版"之间切换。实现步骤按照类型定义 → 配置模块 → 数据迁移与验证 → 数据访问层 → 组件更新 → 集成联调的顺序推进。

## Tasks

- [x] 1. 定义类型接口与配置模块
  - [x] 1.1 扩展 TypeScript 类型定义
    - 在 `src/types/constitution.ts` 中新增 `ConstitutionId` 联合类型（9 种体质标识符）
    - 新增 `CopywritingMode` 类型（`'concise' | 'detailed'`）
    - 新增 `MedicinalRecipe` 接口（`name: string`, `preparation: string`）
    - 新增 `DetailedConstitutionInfo` 接口（`id: ConstitutionId`, `name`, `description`, `causes: string[]`, `dietaryAdvice`, `recommendedFoods`, `avoidFoods`, `medicinalRecipes: MedicinalRecipe[]`）
    - 导出所有新增类型
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 创建应用配置文件
    - 创建 `src/config/app-config.ts`
    - 定义 `AppConfig` 接口包含 `copywritingMode: CopywritingMode`
    - 导出默认配置对象，`copywritingMode` 默认值为 `'concise'`
    - _Requirements: 3.1, 3.3, 5.1, 5.4_

  - [x] 1.3 创建配置 composable
    - 创建 `src/composables/useCopywritingConfig.ts`
    - 实现 `resolveMode` 函数：非法值回退到 `'concise'`
    - 实现 `useCopywritingConfig()` 返回 `{ mode: Readonly<Ref<CopywritingMode>> }`
    - _Requirements: 3.2, 3.4, 5.5_

- [x] 2. Checkpoint - 确认类型与配置模块
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. 数据迁移与验证
  - [x] 3.1 创建数据验证工具
    - 创建 `src/utils/validate-detailed-data.ts`
    - 实现 `validateDetailedData(entries: unknown[]): DetailedConstitutionInfo[]`
    - 验证条目数量为 9、每个 `id` 合法、必填字段非空、`causes` 和 `medicinalRecipes` 非空数组
    - 验证失败时抛出描述性错误，指明具体条目和字段
    - _Requirements: 2.4, 2.5_

  - [ ]\* 3.2 编写 validateDetailedData 属性测试
    - **Property 1: Validation rejects invalid data with specific error reporting**
    - 使用 fast-check 生成各种无效数据组合（错误条目数、无效 ID、空字段、空数组）
    - 验证函数对所有无效输入抛出包含具体条目/字段信息的错误
    - **Validates: Requirements 2.4, 2.5**

  - [ ]\* 3.3 编写 resolveMode 属性测试
    - **Property 2: Config fallback for invalid values**
    - 使用 fast-check 生成任意字符串，验证非 `'concise'`/`'detailed'` 值均回退到 `'concise'`
    - 验证合法值 `'concise'` 和 `'detailed'` 原样返回
    - **Validates: Requirements 3.2, 5.5**

  - [x] 3.4 创建详细版文案数据文件
    - 创建 `src/data/constitutions-detailed.json`
    - 从 DAQ 项目 `/home/zenghui/projects/pt/daq/www/src/components/tizhi/` 目录下的 9 个 Vue 文件中提取文案内容
    - 按 `DetailedConstitutionInfo` 接口结构组织数据
    - 确保 9 种体质（平和、气虚、阳虚、阴虚、痰湿、湿热、血瘀、气郁、特禀）数据完整
    - 保持原始文本语义不变
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]\* 3.5 编写详细版数据完整性单元测试
    - 验证 JSON 文件包含 9 个条目
    - 验证每个条目的所有必填字段非空
    - 验证所有 `id` 值合法
    - 调用 `validateDetailedData` 确认通过验证
    - _Requirements: 2.1, 2.4_

- [x] 4. Checkpoint - 确认数据迁移与验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 数据访问层与组件更新
  - [x] 5.1 扩展 useConstitution composable
    - 在 `src/composables/useConstitution.ts` 中导入详细版数据和 `useCopywritingConfig`
    - 新增 `getDetailedConstitutionInfo(id: string): DetailedConstitutionInfo | undefined` 函数
    - 在加载时调用 `validateDetailedData` 验证数据完整性
    - 导出新函数供组件使用
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]\* 5.2 编写 getDetailedConstitutionInfo 属性测试
    - **Property 7: getDetailedConstitutionInfo lookup correctness**
    - 使用 fast-check 生成随机字符串 ID
    - 验证 9 个合法 ID 返回对应对象，其他 ID 返回 `undefined`
    - **Validates: Requirements 6.1, 6.3**

  - [x] 5.3 更新 ConstitutionDetail 组件支持双模式渲染
    - 修改 `src/components/ConstitutionDetail.vue`
    - 扩展 props：新增可选 `detailedInfo?: DetailedConstitutionInfo` 和 `mode: CopywritingMode`
    - `concise` 模式：保持现有 6 字段渲染（主要特征、形体特征、常见表现、心理特征、发病倾向、环境适应能力）
    - `detailed` 模式：渲染 6 个区域（体质描述、形成原因、饮食调养、宜食、少食、推荐药膳）
    - `causes` 数组使用 QChip 组件水平排列
    - `medicinalRecipes` 数组渲染为列表项（name 为标签，preparation 为正文）
    - `causes` 或 `medicinalRecipes` 为空时隐藏对应区域
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]\* 5.4 编写 ConstitutionDetail 组件属性测试
    - **Property 3: Detailed mode renders all required sections**
    - **Property 4: Concise mode renders all required fields**
    - **Property 5: Causes array renders as distinct elements**
    - **Property 6: Recipes array renders as distinct list items**
    - 使用 fast-check 生成随机有效数据，验证渲染完整性
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [x] 6. 集成联调
  - [x] 6.1 更新 ResultPage 页面集成
    - 修改 `src/pages/ResultPage.vue`
    - 导入 `useCopywritingConfig` 获取当前模式
    - 导入 `getDetailedConstitutionInfo` 函数
    - 向 `ConstitutionDetail` 组件传递 `mode` 和 `detailedInfo` props
    - _Requirements: 5.2, 5.3_

  - [ ]\* 6.2 编写集成单元测试
    - 验证 `concise` 模式下 ResultPage 渲染简洁版内容
    - 验证 `detailed` 模式下 ResultPage 渲染详细版内容
    - _Requirements: 5.2, 5.3_

- [x] 7. Final checkpoint - 确认所有功能完整
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- DAQ 源数据路径: `/home/zenghui/projects/pt/daq/www/src/components/tizhi/`（平和.vue, 气虚.vue, 阳虚.vue, 阴虚.vue, 痰湿.vue, 湿热.vue, 血瘀.vue, 气郁.vue, 特禀.vue）
- 测试框架: Vitest + `@fast-check/vitest`（已安装）
- 组件测试需要 `@vue/test-utils`（需确认是否已安装）

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["3.1", "3.4"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.5"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3"] },
    { "id": 6, "tasks": ["5.4", "6.1"] },
    { "id": 7, "tasks": ["6.2"] }
  ]
}
```
