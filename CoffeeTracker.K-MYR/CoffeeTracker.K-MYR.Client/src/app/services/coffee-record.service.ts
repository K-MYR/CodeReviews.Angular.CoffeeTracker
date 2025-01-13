import { RecordsSearch } from '../interfaces/records-search';
import { CoffeeRecord } from '../interfaces/coffee-record';
import { PostCoffeeRecord } from '../interfaces/post-coffee-record';
import { PaginatedList } from '../interfaces/paginated-list';
import { API_ROUTES } from '../../API_ROUTES';
import { OrderDirection } from '../enums/order-direction';
import { RecordSearchState } from '../interfaces/record-search-state';

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
    pageSize: 10,
    page: 1,
    hasPrevious: false,
    hasNext: false,
    orderBy: "dateTime",
    orderDirection: OrderDirection.Descending,
    records: [],
  })
  isLoading = computed(() => this.state().isLoading);
  records = computed(() => this.state().records);
  page = computed(() => this.state().page);
  pageSize = computed(() => this.state().pageSize);
  orderBy = computed(() => this.state().orderBy);
  orderDirection = computed(() => this.state().orderDirection);
  hasNext = computed(() => this.state().hasNext);
  hasPrevious = computed(() => this.state().hasPrevious);

  private readonly filterParameters$ = new BehaviorSubject<RecordsSearch>({ orderBy: 'dateTime', orderDirection: OrderDirection.Descending });
    
  constructor(private readonly _httpClient: HttpClient) {
    this.filterParameters$.pipe(
      debounceTime(300),
      tap(params => {
        this.setLoadingIndicator(true);
        this.state.update(state => ({
          ...state,
          ...params
        }))
      }),
      switchMap((filters) => this.getCoffeeRecords(filters)),
      takeUntilDestroyed()
    ).subscribe(records => {
      this.setRecords(records.values);
      this.setLoadingIndicator(false);
    });
  }

  private setRecords(records: CoffeeRecord[]): void {
    this.state.update(state => ({
      ...state,
      records: records
    }));
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
      ...state,
      isLoading: isLoading
    }));
  }

  private getCoffeeRecords(searchParams: RecordsSearch): Observable<PaginatedList<CoffeeRecord>>
  {
    return this._httpClient.get<PaginatedList<CoffeeRecord>>(API_ROUTES.GET_RECORDS, {
      params: new HttpParams({ fromObject: { ...searchParams } })
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
