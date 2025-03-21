import { NgChartsConfiguration } from "ng2-charts";
import { ArcElement, Legend, PieController, Colors, Tooltip, Title, ChartOptions, LegendItem, Chart, ChartTypeRegistry, ChartConfiguration } from 'chart.js';

const maxLabelWidth: number = 70;

const globalChartOptions: ChartOptions = {
  normalized: true,
  parsing: false,
  color: '#ffffff',
  plugins: {
    legend: {
      display: true,
      labels: {
        filter: (item: any) => item.text !== undefined   
      }
    },
    tooltip: {
      filter: (item: any) => item.label !== "",
    }
  }
}

export const CHART_DEFAULTS: NgChartsConfiguration = {
  registerables: [PieController, ArcElement, Legend, Colors, Tooltip, Title, {
    id: "emptypiechart",
    beforeInit: function (chart) {
      chart.data.datasets[0].backgroundColor = '#d2dee2';
      chart.data.datasets[0].data.push(Number.MIN_VALUE);
    }
  }],
  defaults: globalChartOptions
}

export function generateTruncatedLabels(chart: Chart): LegendItem[] {
  const config = chart.config as ChartConfiguration;
  const labels = Chart.overrides[config.type].plugins.legend.labels.generateLabels(chart);  
  const context = chart.ctx;
  return labels.map(label => {
    if (!label.text) {
      return label;
    }
    const textWidth = context.measureText(label.text).width;
    if (textWidth > maxLabelWidth) {
      let truncated = label.text;
      while (context.measureText(truncated + '...').width > maxLabelWidth) {
        truncated = truncated.slice(0, -1);
      }
      label.text = truncated + '...';
    }
    return label;
  });
}
