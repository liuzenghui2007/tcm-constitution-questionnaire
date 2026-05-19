import type { CopywritingMode } from 'src/types/constitution';

export interface AppConfig {
  copywritingMode: CopywritingMode;
}

const appConfig: AppConfig = {
  copywritingMode: 'detailed', // 修改此值切换文案版本
};

export default appConfig;
