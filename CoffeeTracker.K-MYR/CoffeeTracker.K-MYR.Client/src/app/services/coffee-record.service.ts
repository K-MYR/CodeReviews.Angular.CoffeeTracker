import { RecordsSearch } from '../interfaces/records-search';
import { CoffeeRecord } from '../interfaces/coffee-record';
import { PostCoffeeRecord } from '../interfaces/post-coffee-record';
import { PaginatedList } from '../interfaces/paginated-list';
import { API_ROUTES } from '../../API_ROUTES';
import { OrderDirection } from '../enums/order-direction';
import { RecordSearchState } from '../interfaces/record-search-state';
import { removeUndefinedValuesFromObject } from '../helpers/helpers';

import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, OnInit, signal } from '@angular/core';
import { debounceTime, Observable, switchMap, BehaviorSubject, tap, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CoffeeRecordService {
  private state = signal<RecordSearchState>({
    isLoading: false,
    startDate: null,
    endDate: null,
    type: null,
    lastId: null,
    lastValue: null,
    isPrevious: false,
    page: 0,
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
    
  constructor(private readonly _httpClient: HttpClient) {
    this.filterParameters$.pipe(
      debounceTime(300),
      tap(params => {
        this.state.update(state => ({
          ...state,
          ...params,
          isLoading: true
        }));
      }),
      switchMap((filters) => this.getCoffeeRecords(filters)),
      takeUntilDestroyed()
    ).subscribe(paginatedList => {
      this.setState(paginatedList);
    });
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

  private getCoffeeRecords(searchParams: RecordsSearch): Observable<PaginatedList<CoffeeRecord>>
  {
    return this._httpClient.get<PaginatedList<CoffeeRecord>>(API_ROUTES.GET_RECORDS, {
      params: new HttpParams({ fromObject: {...removeUndefinedValuesFromObject(searchParams)} })
    })
  }

  postCoffeeRecord(coffeeRecord: PostCoffeeRecord): Observable<CoffeeRecord> {
    return this._httpClient.post<CoffeeRecord>(API_ROUTES.POST_RECORDS, coffeeRecord);
  }

  reload() {
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
