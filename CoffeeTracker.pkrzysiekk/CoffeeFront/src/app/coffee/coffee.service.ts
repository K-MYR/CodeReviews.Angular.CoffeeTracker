import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CoffeeConsumption } from './coffee-consumption';

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  private apiURL = 'http://localhost:5008/api/coffee';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getPaginatedResult(page: number, pageSize: number): Observable<any> {
    const url = `${this.apiURL}?page=${page}&pageSize=${pageSize}`;
    return this.httpClient.get(url).pipe(catchError(this.errorHandler));
  }

  create(coffeeConsumption: CoffeeConsumption): Observable<any> {
    return this.httpClient
      .post(this.apiURL, JSON.stringify(coffeeConsumption), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  find(id: number): Observable<any> {
    const fetchURL = `${this.apiURL}/${id}`;
    return this.httpClient.get(fetchURL).pipe(catchError(this.errorHandler));
  }

  update(coffeeConsumption: CoffeeConsumption): Observable<any> {
    return this.httpClient
      .put(this.apiURL, JSON.stringify(coffeeConsumption), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  delete(id: number): Observable<any> {
    const deleteUrl = `${this.apiURL}/${id}`;
    return this.httpClient
      .delete(deleteUrl)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
