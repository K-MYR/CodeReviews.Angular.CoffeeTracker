import { Component, input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [ BaseChartDirective ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  chartData = input.required<ChartData>();
  chartOptions = input.required<ChartOptions>();  
}
