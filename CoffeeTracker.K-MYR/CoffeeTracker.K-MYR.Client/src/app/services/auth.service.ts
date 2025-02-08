import { API_ROUTES } from '../../API_ROUTES';
import { PostLogin } from '../interfaces/post-login';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private httpClient = inject(HttpClient);

  constructor() { }

  isLoggedIn(): Observable<HttpResponse<void>> {
    return this.httpClient.get<void>(API_ROUTES.GET_ACC_STATUS, { observe: 'response'})      
  }

  login(credentials: PostLogin): Observable<void> {
    return this.httpClient.post<void>(API_ROUTES.POST_LOGIN, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }     
    })
  }
}
