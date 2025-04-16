import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, GuardResult, MaybeAsync, Router, CanActivateFn } from '@angular/router';
import { hasNoNulls } from '../helpers/general';
import { ConfirmEmail } from '../interfaces/confirm-email';

const CONFIRM_EMAIL_QUERY_PARAMS: ConfirmEmail = {
  userId: "",
  code: ""
}

export const CONFIRM_EMAIL_QUERY_PARAM_KEYS: Array<keyof ConfirmEmail> = Object.keys(CONFIRM_EMAIL_QUERY_PARAMS) as Array<keyof ConfirmEmail>;

function confirmEmailGuardFn(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> {
  var isValidModel = hasNoNulls<ConfirmEmail>(
    route.queryParams,
    CONFIRM_EMAIL_QUERY_PARAM_KEYS
  );

  if (isValidModel) {    
    return true;
  }
  var router = inject(Router);
  router.navigateByUrl('/dashboard');
  return false;
}

export const confirmEmailGuard: CanActivateFn = confirmEmailGuardFn;


