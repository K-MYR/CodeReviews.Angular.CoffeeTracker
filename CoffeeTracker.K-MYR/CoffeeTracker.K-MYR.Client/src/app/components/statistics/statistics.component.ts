import { DataUpdateService } from '../../services/data-update.service';
import { CounterComponent } from '../counter/counter.component';
import { TypeStatistic } from '../../interfaces/type-statistic'

import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { debounceTime, switchMap, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CoffeeRecordsService } from '../../services/coffee-records.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CounterComponent],
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
