import { boot } from 'quasar/wrappers';
import { use } from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// 按需注册 ECharts 组件
use([CanvasRenderer, RadarChart, TitleComponent, TooltipComponent, LegendComponent]);

export default boot(({ app }) => {
  app.component('VChart', VChart);
});
