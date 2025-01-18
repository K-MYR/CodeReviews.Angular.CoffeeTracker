import { CoffeeRecord } from '../interfaces/coffee-record';
import { PaginatedList } from '../interfaces/paginated-list';
import { PostCoffeeRecord } from '../interfaces/post-coffee-record';
import { RecordsSearch } from '../interfaces/records-search';
import { TypeStatistic } from '../interfaces/type-statistic';
import { API_ROUTES } from '../../API_ROUTES';
import { removeUndefinedValuesFromObject } from '../helpers/helpers';

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoffeeRecordsService {
  private readonly _httpClient = inject(HttpClient);

  constructor() { }

  getCoffeeRecords(searchParams: RecordsSearch): Observable<PaginatedList<CoffeeRecord>> {
    return this._httpClient.get<PaginatedList<CoffeeRecord>>(API_ROUTES.GET_RECORDS, {
      params: new HttpParams({ fromObject: { ...removeUndefinedValuesFromObject(searchParams) } })
    });
  }

  getStatistics(date: Date): Observable<TypeStatistic[]> {
    return this._httpClient.get<TypeStatistic[]>(API_ROUTES.GET_STATISTICS, {
      params: new HttpParams({ fromObject: { date: date.toISOString() } })
    });
  }

  postCoffeeRecord(coffeeRecord: PostCoffeeRecord): Observable<CoffeeRecord> {
    return this._httpClient.post<CoffeeRecord>(API_ROUTES.POST_RECORDS, coffeeRecord, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
