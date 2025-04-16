import { CoffeeRecordsService } from '../../services/coffee-records.service';
import { DataUpdateService } from '../../services/data-update.service';
import { CounterComponent } from '../counter/counter.component';
import { TypeStatistic } from '../../interfaces/type-statistic'
import { ChartComponent } from '../shared/chart/chart.component';

import { ChartData, ChartOptions } from 'chart.js';
import { generateTruncatedLabels } from '../../chart.defaults';

import { Component, computed, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CounterComponent, ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  private statistics = signal<TypeStatistic[]>([]);
  private readonly _coffeeRecordService = inject(CoffeeRecordsService);
  private readonly _dataUpdateService = inject(DataUpdateService);
  private readonly destroyRef = inject(DestroyRef);
  private year$ = new BehaviorSubject<Date>(new Date);
  counters = computed(() => {
    var counters: TypeStatistic = {
      coffeeType: 'Overall',
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      yearCount: 0
    }
    this.statistics().forEach((typeStats) => {
      counters.dayCount += typeStats.dayCount;
      counters.weekCount += typeStats.weekCount;
      counters.monthCount += typeStats.monthCount;
      counters.yearCount += typeStats.yearCount;
    });
    return counters;
  });
  chartData: Signal<ChartData<'doughnut', number[]>> = computed(() => {
    var data = this.statistics().map(stats => (stats.yearCount));
    if (data.length === 0) {
      data.push(Number.MIN_VALUE);
    }    
    return {
      datasets: [{
        cutout: '40%',
        data: data,
      }],
      labels: this.statistics().map(stats => (stats.coffeeType))
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
          label: (context: any) => context?.parsed ? ` ${context.parsed} Cups` : ''      
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
    this.year$.pipe(
      switchMap((year) => this._coffeeRecordService.getStatistics(year)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(statistics => {
      this.statistics.update(_ => statistics);
    });

    this._dataUpdateService.dataChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(_ => this.reload());
  }

  reload() {
    this.year$.next(this.year$.value);
  }
}
