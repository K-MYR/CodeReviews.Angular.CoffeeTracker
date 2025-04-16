import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  var authService = inject(AuthService);
  var router = inject(Router);
  return authService.isLoggedIn().pipe(
    map(response => {
      if (response.status === HttpStatusCode.Ok) {
        return true;
      } else {
        router.navigateByUrl('/auth/login');
        return false;
      }
    }),
    catchError((response: HttpErrorResponse) => {
      if (response.status === HttpStatusCode.Unauthorized) {
        router.navigateByUrl('/auth/login');        
      } 
      return of(false);
    })
  )
};
