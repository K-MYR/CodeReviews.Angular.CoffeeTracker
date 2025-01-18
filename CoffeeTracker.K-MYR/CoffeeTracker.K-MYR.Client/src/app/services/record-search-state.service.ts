import { RecordsSearch } from '../interfaces/records-search';
import { CoffeeRecord } from '../interfaces/coffee-record';
import { PaginatedList } from '../interfaces/paginated-list';
import { RecordSearchState } from '../interfaces/record-search-state';
import { OrderDirection } from '../enums/order-direction';
import { DataUpdateService } from './data-update.service';
import { CoffeeRecordsService } from './coffee-records.service';

import { computed, inject, Injectable,  signal } from '@angular/core';
import { debounceTime, switchMap, BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class RecordSearchStateService {
  private readonly _coffeeRecordsService = inject(CoffeeRecordsService)
  private readonly _dataUpdateService = inject(DataUpdateService);
  private state = signal<RecordSearchState>({
    isLoading: false,
    startDate: null,
    endDate: null,
    type: null,
    lastId: null,
    lastValue: null,
    isPrevious: false,
    page: 1,
    pageSize: 10,
    orderBy: "dateTime",
    orderDirection: OrderDirection.Descending,
    hasPrevious: false,
    hasNext: false,    
    records: [],
  })
  isLoading = computed(() => this.state().isLoading);
  records = computed(() => this.state().records);
  isPrevious = computed(() => this.state().isPrevious)
  pageSize = computed(() => this.state().pageSize);
  page = computed(() => this.state().page);
  orderBy = computed(() => this.state().orderBy);
  orderDirection = computed(() => this.state().orderDirection);
  hasNext = computed(() => this.state().hasNext);
  hasPrevious = computed(() => this.state().hasPrevious);

  private readonly filterParameters$ = new BehaviorSubject<RecordsSearch>({ orderBy: 'dateTime', orderDirection: OrderDirection.Descending });
    
  constructor() {
    this.filterParameters$.pipe(    
      debounceTime(150),
      tap(params => {
        this.state.update(state => ({
          ...state,
          ...params,
          isLoading: true
        }));
      }),
      switchMap((filters) => this._coffeeRecordsService.getCoffeeRecords(filters)),
      takeUntilDestroyed()
    ).subscribe(paginatedList => {
      this.setState(paginatedList);
    });

    this._dataUpdateService.dataChanged$
      .pipe(
        takeUntilDestroyed()
      ).subscribe(_ => this.reload());
  }

  private setState(list: PaginatedList<CoffeeRecord>): void {
    this.state.update(state => ({
      ...state,
      records: list.values,
      hasNext: list.hasNext,
      hasPrevious: list.hasPrevious,
      isLoading: false,
      page: !list.hasPrevious ? 1 : state.lastId == null ? state.page : state.page + (state.isPrevious ? -1 : 1)
    }));
  }

  private reload() {
    this.filterParameters$.next(
      this.filterParameters$.value,
    );
  }

  updateFilter(params: Partial<RecordsSearch>) {
    this.filterParameters$.next({
      ...this.filterParameters$.value,
      ...params
    });
  } 
}
