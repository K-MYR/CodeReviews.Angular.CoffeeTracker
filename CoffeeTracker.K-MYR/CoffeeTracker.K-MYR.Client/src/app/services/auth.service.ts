import { API_ROUTES } from '../../API_ROUTES';
import { PostLogin } from '../interfaces/post-login';
import { ConfirmEmail } from '../interfaces/confirm-email';
import { PostRegister } from '../interfaces/post-register';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResendEmail } from '../interfaces/resend-email';
import { AccountInfo } from '../interfaces/account-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private httpClient = inject(HttpClient);

  constructor() { }

  isLoggedIn(): Observable<HttpResponse<void>> {
    return this.httpClient.get<void>(
      API_ROUTES.GET_ACC_STATUS,
      { observe: 'response' });      
  }

  login(credentials: PostLogin): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.POST_LOGIN, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        useCookies: true
      },
      observe: 'response'
    });
  }

  register(credentials: PostRegister): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.POST_REGISTER, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    });
  }

  confirmEmail(confirmEmail: ConfirmEmail): Observable<HttpResponse<void>> {
    return this.httpClient.get<void>(
      API_ROUTES.CONFIRM_EMAIL(confirmEmail.userId, confirmEmail.code),
      { observe: 'response' }
    );
  }

  resendEmail(resendEmail: ResendEmail): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.RESEND_EMAIL, resendEmail, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    });
  }

  getInfo(): Observable<HttpResponse<AccountInfo>> {
    return this.httpClient.get<AccountInfo>(API_ROUTES.ACCOUNT_INFO,
      { observe: 'response' }
    );
  }
}
