import { CoffeeRecordsService } from '../../services/coffee-records.service';
import { DataUpdateService } from '../../services/data-update.service';
import { CounterComponent } from '../counter/counter.component';
import { TypeStatistic } from '../../interfaces/type-statistic'
import { ChartComponent } from '../chart/chart.component';
import { ChartData, ChartOptions } from 'chart.js';

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
    return {
      datasets: [{
        cutout: '40%',
        data: this.statistics().map(stats => (stats.yearCount))
      }],
      labels: this.statistics().map(stats => (stats.coffeeType))
    }
  });
  chartOptions: ChartOptions = {
    parsing: false,
    normalized: true,
    maintainAspectRatio: false
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
