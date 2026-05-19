# Requirements Document

## Introduction

本功能为 TCM 体质问卷项目实现"体质文案可配置切换"机制。将 DAQ 旧版项目中 9 种体质的详细养生建议文案（包含体质描述、形成原因、饮食调养、宜食/少食、推荐药膳等）迁移到 TCM 项目中，并提供配置开关让用户在"简洁版"（当前 TCM 版本）和"详细版"（DAQ 移植版）之间切换显示。

## Glossary

- **TCM_App**: tcm-constitution-questionnaire 项目，即当前 Vue 3 + Quasar + TypeScript 体质问卷应用
- **Copywriting_Config**: 文案配置模块，负责管理和切换文案版本
- **Concise_Copywriting**: 简洁版文案，即当前 TCM 项目中 constitutions.json 所包含的体质特征信息（主要特征、形体特征、常见表现、心理特征、发病倾向、环境适应能力）
- **Detailed_Copywriting**: 详细版文案，从 DAQ 项目移植的养生建议内容（体质描述、形成原因、饮食调养、宜食、少食、推荐药膳）
- **Constitution_Detail_Component**: 体质详情展示组件，负责根据当前配置渲染对应版本的文案
- **Detailed_Data_Store**: 详细版文案数据存储，以 JSON 格式保存 9 种体质的详细养生建议数据

## Requirements

### Requirement 1: 详细版文案数据结构定义

**User Story:** As a 开发者, I want 定义详细版文案的 TypeScript 类型接口, so that 详细版数据具有明确的类型约束和良好的可维护性。

#### Acceptance Criteria

1. THE TCM_App SHALL define a `MedicinalRecipe` TypeScript interface containing the following required fields: `name` (string) and `preparation` (string)
2. THE TCM_App SHALL define a `DetailedConstitutionInfo` TypeScript interface containing the following required fields: `id` (string), `name` (string), `description` (string), `causes` (string array with at least 1 element), `dietaryAdvice` (string), `recommendedFoods` (string), `avoidFoods` (string), `medicinalRecipes` (array of `MedicinalRecipe` with at least 1 element)
3. THE TCM_App SHALL export both the `DetailedConstitutionInfo` and `MedicinalRecipe` interfaces from the `src/types/constitution.ts` module
4. THE TCM_App SHALL define the `id` field of `DetailedConstitutionInfo` as constrained to one of the 9 constitution identifiers: `pinghe`, `qixu`, `yangxu`, `yinxu`, `tanshi`, `shire`, `xueyu`, `qiyu`, `tebing`

### Requirement 2: 详细版文案数据迁移

**User Story:** As a 用户, I want 在 TCM 项目中查看 DAQ 旧版的详细养生建议, so that 能获得更丰富的体质调养指导信息。

#### Acceptance Criteria

1. THE Detailed_Data_Store SHALL contain detailed copywriting data for all 9 constitutions: 平和质, 气虚质, 阳虚质, 阴虚质, 痰湿质, 湿热质, 血瘀质, 气郁质, 特禀质, where each entry conforms to the `DetailedConstitutionInfo` interface with all fields populated as non-empty values
2. THE Detailed_Data_Store SHALL preserve the original text content from the DAQ project for each constitution's description, causes, dietary advice, recommended foods, foods to avoid, and medicinal recipes, where "preserve" means the textual content is semantically identical to the DAQ source (no omission or alteration of meaning)
3. THE Detailed_Data_Store SHALL store data in a JSON file located at `src/data/constitutions-detailed.json`
4. WHEN the Detailed_Data_Store is loaded, THE TCM_App SHALL validate that each entry contains a non-empty `id` field matching one of the 9 constitution identifiers (pinghe, qixu, yangxu, yinxu, tanshi, shire, xueyu, qiyu, tebing) and that the total entry count equals 9
5. IF validation of the Detailed_Data_Store fails due to a missing constitution entry, an unrecognized `id` value, or an empty required field, THEN THE TCM_App SHALL throw an error indicating which constitution entry or field failed validation

### Requirement 3: 文案版本配置机制

**User Story:** As a 开发者, I want 通过配置文件选择使用哪套文案, so that 可以在构建或部署时确定使用的文案版本。

#### Acceptance Criteria

1. THE Copywriting_Config SHALL support exactly two copywriting modes represented as a TypeScript union type: `'concise' | 'detailed'`
2. IF the configuration file does not contain the copywriting mode key or the key value is not one of the allowed modes (`concise`, `detailed`), THEN THE Copywriting_Config SHALL fall back to `concise` mode
3. THE Copywriting_Config SHALL read the selected mode from a static configuration file (e.g. `src/config/app-config.ts`) so that the mode is determined at build time and does not change at runtime
4. THE Copywriting_Config SHALL expose a reactive composable function `useCopywritingConfig()` that returns an object containing a readonly `Ref<'concise' | 'detailed'>` property representing the current mode

### Requirement 4: 详细版文案展示组件

**User Story:** As a 用户, I want 在详细版模式下看到体质描述、形成原因、饮食调养、宜食/少食、推荐药膳等完整信息, so that 能获得全面的养生调理建议。

#### Acceptance Criteria

1. WHEN the Copywriting_Config is set to `detailed` mode, THE Constitution_Detail_Component SHALL display the following sections in order for each constitution: 体质描述, 形成原因, 饮食调养, 宜食, 少食, 推荐药膳
2. WHEN the Copywriting_Config is set to `concise` mode, THE Constitution_Detail_Component SHALL display the following fields in order for each constitution: 主要特征, 形体特征, 常见表现, 心理特征, 发病倾向, 环境适应能力
3. WHEN the Copywriting_Config is set to `detailed` mode, THE Constitution_Detail_Component SHALL render each item in the `causes` array as a visually distinct inline element (e.g., Quasar QBadge or QChip component) displayed in a horizontal-wrap layout
4. WHEN the Copywriting_Config is set to `detailed` mode, THE Constitution_Detail_Component SHALL render each entry in the `medicinalRecipes` array as a distinct list item displaying the recipe `name` as a label and the `preparation` text as body content beneath it
5. IF the `causes` array is empty or the `medicinalRecipes` array is empty in detailed mode, THEN THE Constitution_Detail_Component SHALL hide the corresponding section entirely rather than displaying an empty section

### Requirement 5: 配置文件驱动的文案版本选择

**User Story:** As a 开发者, I want 通过修改配置文件即可切换文案版本, so that 部署不同版本时只需更改一处配置。

#### Acceptance Criteria

1. THE TCM_App SHALL read the copywriting mode exclusively from the `copywritingMode` key in the application configuration file, and no other source SHALL override this value
2. WHEN the configuration file specifies `detailed` as the `copywritingMode` value, THE Constitution_Detail_Component SHALL render the detailed version content on all result pages that display constitution information
3. WHEN the configuration file specifies `concise` as the `copywritingMode` value, THE Constitution_Detail_Component SHALL render the concise version content on all result pages that display constitution information
4. THE configuration file SHALL accept only the string values `concise` or `detailed` for the `copywritingMode` key
5. IF the `copywritingMode` key is absent or contains a value other than `concise` or `detailed`, THEN THE TCM_App SHALL fall back to `concise` mode

### Requirement 6: 数据访问层适配

**User Story:** As a 开发者, I want useConstitution composable 能根据当前配置返回对应版本的数据, so that 组件层无需关心数据来源的切换逻辑。

#### Acceptance Criteria

1. WHEN the Copywriting_Config is set to `detailed` mode, THE `useConstitution` composable SHALL provide a `getDetailedConstitutionInfo(id: string)` function that returns `DetailedConstitutionInfo | undefined` by looking up the constitution id in the Detailed_Data_Store
2. WHEN the Copywriting_Config is set to `concise` mode, THE `useConstitution` composable SHALL provide the existing `getConstitutionInfo(id: string)` function returning `ConstitutionInfo | undefined` from the concise data source
3. IF a constitution id is not found in the Detailed_Data_Store when `getDetailedConstitutionInfo` is called, THEN THE `useConstitution` composable SHALL return `undefined`
4. THE `useConstitution` composable SHALL internally read the current mode from `useCopywritingConfig()` to determine which data source to query
