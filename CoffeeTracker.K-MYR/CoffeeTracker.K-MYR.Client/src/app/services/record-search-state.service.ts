import { RecordsSearchFilter, RecordsSearchParameters } from '../interfaces/records-search';
import { CoffeeRecord } from '../interfaces/coffee-record';
import { PaginatedList } from '../interfaces/paginated-list';
import { RecordSearchState } from '../interfaces/record-search-state';
import { OrderDirection } from '../enums/order-direction';
import { DataUpdateService } from './data-update.service';
import { CoffeeRecordsService } from './coffee-records.service';
import { computed, inject, Injectable,  signal } from '@angular/core';
import { switchMap, BehaviorSubject, tap, Subject, combineLatest, distinctUntilChanged, throttleTime, startWith, map, debounceTime, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RecordSearchStateService {
  private readonly _notificationService = inject(NotificationService);
  private readonly _coffeeRecordsService = inject(CoffeeRecordsService)
  private readonly _dataUpdateService = inject(DataUpdateService);
  private state = signal<RecordSearchState>({
    isLoading: false,
    from: undefined,
    to: undefined,
    type: undefined,
    lastId: undefined,
    lastValue: undefined,
    isPrevious: false,
    page: 1,
    pageSize: 10,
    orderBy: "dateTime",
    orderDirection: OrderDirection.Descending,
    hasPrevious: false,
    hasNext: false,
    records: [],
  });
  isLoading = computed(() => this.state().isLoading);
  records = computed(() => this.state().records);
  lastId = computed(() => this.state().lastId);
  lastValue = computed(() => this.state().lastValue);
  isPrevious = computed(() => this.state().isPrevious);
  pageSize = computed(() => this.state().pageSize);
  page = computed(() => this.state().page);
  orderBy = computed(() => this.state().orderBy);
  orderDirection = computed(() => this.state().orderDirection);
  hasNext = computed(() => this.state().hasNext);
  hasPrevious = computed(() => this.state().hasPrevious);

  private readonly filterParameters$ = new BehaviorSubject<RecordsSearchFilter>({ orderBy: this.orderBy(), orderDirection: this.orderDirection() });
  private readonly reload$ = new BehaviorSubject<void>(void 0);
  private readonly page$ = new BehaviorSubject<Page>({
    pageNumber: this.page(),
    isPrevious: this.isPrevious(),
    pageSize: this.pageSize()
  });
    
  constructor() {
    const filters$ = this.filterParameters$.pipe(
      takeUntilDestroyed()
    );

    const reload$ = this.reload$.pipe(
      takeUntilDestroyed()
    );

    const page$ = this.page$.pipe(
      takeUntilDestroyed()
    );

    combineLatest([filters$, page$, reload$])
      .pipe(
        debounceTime(100),
        tap(() => this.setLoading(true)),
        switchMap(([filters, page]) => {
          const searchParams: RecordsSearchParameters = {
            ...filters,
            lastId: page.lastId,
            lastValue: page.lastValue,
            isPrevious: page.isPrevious,
            pageSize: page.pageSize
          }
          return this._coffeeRecordsService
            .getCoffeeRecords(searchParams).pipe(
              map(paginatedListResponse => {
                const values: CoffeeRecord[] = paginatedListResponse.values.map(record => ({
                  ...record,
                  dateTime: new Date(record.dateTime)
                }));
                const paginatedList: PaginatedList<CoffeeRecord> = {
                  ...paginatedListResponse,
                  values: values
                }
                return { paginatedList, page, searchParams } 
              }),
              catchError(() => {
                this._notificationService.addMessage("Something went wrong while loading the records. Please try again.", "error");
                this.setLoading(false);
                return EMPTY;
              })
            );
        }),
        takeUntilDestroyed()
    ).subscribe({
      next: ({ paginatedList, page, searchParams }) => {
        this.setRecords(paginatedList);
        this.setPage(paginatedList.hasPrevious ? page.pageNumber : 1);
        this.setFilters(searchParams);
        this.setLoading(false);
      },
      error: () => {
        this._notificationService.addMessage("Something went wrong while loading the records. Please try again.", "error");
        this.setLoading(false);
      }
    });

    this._dataUpdateService.dataChanged$
      .pipe(
        takeUntilDestroyed()
      ).subscribe(_ => this.reload());
  }

  private setFilters(filters: RecordsSearchParameters) {
    this.state.update(state => ({
      ...state,
      ...filters,
    }))
  }
    
  private setPage(page: number) {
    this.state.update(state => ({
      ...state,
      page: page
    }))
  }

  private setLoading(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

  private setRecords(list: PaginatedList<CoffeeRecord>): void {
    this.state.update(state => ({
      ...state,
      records: list.values,
      hasNext: list.hasNext,
      hasPrevious: list.hasPrevious,
      isPrevious: list.isPrevious,
    }));
  }

  private reload() {
    this.reload$.next();
  }

  changePage(isPrevious: boolean = false): void {
    const state = this.state();
    if (state.isLoading || isPrevious ? !state.hasPrevious : !state.hasNext) {
      return;
    }

    const index = isPrevious ? 0 : state.records.length - 1;
    const pageNumber = state.page + (isPrevious ? -1 : 1);
    const lastRecord = state.records[index];
    let lastValue = undefined;
    if (!(state.orderBy === 'id')) {
      lastValue = state.orderBy === 'dateTime' ? lastRecord.dateTime.toISOString() : lastRecord[state.orderBy].toString()
    }

    this.page$.next({
      lastId: pageNumber === 1 ? undefined : lastRecord?.id,
      lastValue: pageNumber === 1 ? undefined : lastValue,
      isPrevious: pageNumber === 1 ? false : state.isPrevious,
      pageNumber: pageNumber,
      pageSize: state.pageSize
    });
  }

  changePageSize(pageSize: number) {
    if (pageSize < 1) {
      return;
    }
    const state = this.state();
    const numberOfRecordsBefore = (state.page - 1) * state.pageSize;
    const pageNumber = Math.floor(numberOfRecordsBefore / pageSize) + 1;
    this.page$.next({
      lastId: pageNumber === 1 ? undefined : state.lastId,
      lastValue: pageNumber === 1 ? undefined : state.lastValue,
      isPrevious: pageNumber === 1 ? false : state.isPrevious,
      pageSize: pageSize,
      pageNumber: pageNumber,
    });
  }

  updateFilter(params: Partial<RecordsSearchFilter>) {  
    this.filterParameters$.next({
      ...this.filterParameters$.value,
      ...params
    });
    this.page$.next({
      ...this.page$.value,
      lastId: undefined,
      lastValue: undefined,
      pageNumber: 1,
      isPrevious: false
    });
  } 
}

interface Page {
  pageNumber: number;
  pageSize: number;
  lastId?: number | undefined;
  lastValue?: string | number | undefined;
  isPrevious: boolean;
}
