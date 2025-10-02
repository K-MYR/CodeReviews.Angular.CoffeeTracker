import { CoffeeRecordsService } from '../../services/coffee-records.service';
import { DataUpdateService } from '../../services/data-update.service';
import { CounterComponent } from '../counter/counter.component';
import { ChartComponent } from '../shared/chart/chart.component';
import { ChartData, ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { generateTruncatedLabels, truncateString } from '../../chart.defaults';
import { Component, computed, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeStatistic } from '../../interfaces/type-statistic';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CounterComponent, ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  maxChartSlots = signal<number>(8);
  private readonly _coffeeRecordService = inject(CoffeeRecordsService);
  private readonly _dataUpdateService = inject(DataUpdateService);
  private readonly destroyRef = inject(DestroyRef);
  private year$ = new BehaviorSubject<Date>(new Date);
  private statistics = signal<TypeStatistic[]>([]);
  private sumsOfStatistics = computed<StatisticsTotals>(() =>
    this.statistics().reduce((acc, curr) => {
      acc.dayCount += curr.dayCount;
      acc.weekCount += curr.weekCount;
      acc.monthCount += curr.monthCount;
      acc.yearCount += curr.yearCount;
      acc.allTime += curr.allTime;
      return acc;
    }, new StatisticsTotals())
  );
  key = signal<keyof StatisticsTotals>('allTime');
  counterBoxes: Signal<CounterBox[]> = computed(() => {
    const sums = this.sumsOfStatistics();
    const counterBoxes: CounterBox[] = [
      { text: 'Today', count: sums.dayCount, key: 'dayCount' },
      { text: 'Week', count: sums.weekCount, key: 'weekCount' },
      { text: 'Month', count: sums.monthCount, key: 'monthCount' },
      { text: 'Year', count: sums.yearCount, key: 'yearCount' },
      { text: 'Total ∑', count: sums.allTime, key: 'allTime' },
    ]
    return counterBoxes;
  });
  sortedStatistics = computed(() => {
    const key = this.key();
    return this.statistics()
      .filter((statistic) => statistic[key] > 0)
      .sort((a, b) => b[key] - a[key]);
  })
  chartData: Signal<ChartData<'doughnut', number[]>> = computed(() => {
    const key = this.key();
    const maxSlots = Math.max(this.maxChartSlots(), 0);
    let data = this.sortedStatistics();
    let backgroundColors = undefined;
    const placeholder = new TypeStatistic("");
    placeholder[key] = Number.MIN_VALUE;
    if (data.length === 0) {
      data.push(placeholder);
      backgroundColors = ['#d2dee2'];
    }
    else if (data.length > maxSlots) {
      const bucket: TypeStatistic = data.slice(maxSlots)
        .reduce((acc, val) => {
          acc[key] += val[key];
          return acc;
        }, new TypeStatistic("And More..."));
      data = [...(data.slice(0, maxSlots)), bucket]
    } 

    const labels = data.map((item) => item.coffeeType);
    const chartData = data.map(stats => (stats[key]));
    
    return {
      datasets: [{
        backgroundColor: backgroundColors,
        cutout: '40%',
        data:  chartData,
      }],
      labels: labels
    }
    
  });
  chartOptions: ChartOptions = {    
    maintainAspectRatio: true,
    plugins: {     
      title: {
        display: true,
        text: '# of Cups Per Category'
      },
      tooltip: {        
        callbacks: {
          label: (context) => this.generateLabel(context)
        }
      },
      legend: {
        labels: {
          generateLabels: generateTruncatedLabels
        }
      }
    }
  }

  ngOnInit(): void {
    this.year$
      .pipe(
        switchMap((year) => this._coffeeRecordService.getStatistics(year)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (statistics) => this.statistics.update(_ => statistics),
        error: () => console.warn("Unable to load data.")
      })

    this._dataUpdateService.dataChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => this.reload());
  }

  reload() {
    this.year$.next(this.year$.value);
  }

  setSelectedKey(key: keyof StatisticsTotals): void {
    if (key === this.key()) {
      return;
    }
    this.key.set(key);
  }

  private generateLabel(context: TooltipItem<keyof ChartTypeRegistry>): string|string[] {
    const maxSlots = Math.max(this.maxChartSlots(), 0);
    if (context.dataIndex === maxSlots) {
      const key = this.key();
      const entries = this.sortedStatistics()
        .slice(context.dataIndex);
      const total = entries.reduce((acc, val) => acc += val[key], 0);
      const text = total > 1 ? "Cups" : "Cup";
      return [
        `${total} More ${text} of`,
        ...entries.map((value) => `${value[key]} ${truncateString(value.coffeeType, context.chart.ctx, 120)}`)
      ];
    }
    return `${context.parsed} Cup(s)`;
  }
}

interface CounterBox {
  count: number;
  text: string;
  key: keyof StatisticsTotals
}

class StatisticsTotals {
  allTime: number = 0;
  yearCount: number = 0;
  monthCount: number = 0;
  weekCount: number = 0;
  dayCount: number = 0;

  constructor() { }
}


