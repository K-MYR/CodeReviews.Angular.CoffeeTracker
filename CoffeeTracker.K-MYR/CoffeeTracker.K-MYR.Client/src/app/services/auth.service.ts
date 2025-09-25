import { API_ROUTES } from '../../API_ROUTES';
import { PostLogin } from '../interfaces/post-login';
import { EmailQueryParams } from '../interfaces/email-query-params';
import { PostRegister } from '../interfaces/post-register';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Email } from '../interfaces/email';
import { AccountInfo } from '../interfaces/account-info';
import { PostResetPassword } from '../interfaces/post-reset-password';
import { Credentials } from '../interfaces/credentials';

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

  login(postLogin: PostLogin): Observable<HttpResponse<void>> {
    const credentials: Credentials = {
      email: postLogin.email,
      password: postLogin.password
    };
    return this.httpClient.post<void>(API_ROUTES.POST_LOGIN, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        useCookies: true,
        useSessionCookies: !postLogin.rememberMe
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

  confirmEmail(confirmEmail: EmailQueryParams): Observable<HttpResponse<void>> {
    return this.httpClient.get<void>(
      API_ROUTES.CONFIRM_EMAIL(confirmEmail.userId, confirmEmail.code),
      { observe: 'response' }
    );
  }

  resendConfirmationEmail(email: Email): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.RESEND_CONFIRMATION_EMAIL, email, {
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

  forgotPassword(email: Email): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.FORGOT_PASSWORD, email, {
      headers: {
        'ContentType': 'application/json'
      },
      observe: 'response'
    });
  }

  resetPassword(resetPassword: PostResetPassword): Observable<HttpResponse<void>> {
    return this.httpClient.post<void>(API_ROUTES.RESET_PASSWORD, resetPassword, {
      headers: {
        'ContentType': 'application/json'
      },
      observe: 'response'
    });
  }
}
