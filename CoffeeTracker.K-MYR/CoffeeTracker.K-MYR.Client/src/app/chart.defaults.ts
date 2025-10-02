import { NgChartsConfiguration } from "ng2-charts";
import { ArcElement, Legend, PieController, Colors, Tooltip, Title, ChartOptions, LegendItem, Chart, ChartTypeRegistry, ChartConfiguration } from 'chart.js';

const defaultMaxLabelWidth: number = 90;

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

    let text = label.text;    
    text = truncateString(text, context);
    return { ...label, text: text };
  });
}

export function truncateString(text: string, context: CanvasRenderingContext2D, maxWidth: number = defaultMaxLabelWidth): string {
  let ellipsis = "...";
  let textWidth = context.measureText(text).width;
  if (textWidth <= maxWidth) {
    return text;
  }

  let low = 0;
  let high = text.length;
  let mid = 0;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    let truncated = text.slice(0, mid) + ellipsis;
    let width = context.measureText(truncated).width;
    if (width <= maxWidth) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return text.slice(0, mid) + ellipsis;
}
