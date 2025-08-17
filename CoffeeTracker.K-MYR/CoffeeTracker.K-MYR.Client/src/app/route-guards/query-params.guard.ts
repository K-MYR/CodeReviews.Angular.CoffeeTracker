import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, GuardResult, MaybeAsync, Router, CanActivateFn } from '@angular/router';
import { hasNoNullsFromMap } from '../helpers/general';
import { EmailQueryParams } from '../interfaces/email-query-params';

const EMAIL_QUERY_PARAMS: EmailQueryParams = {
  userId: "",
  code: ""
}

export const EMAIL_QUERY_PARAM_KEYS: Array<keyof EmailQueryParams> = Object.keys(EMAIL_QUERY_PARAMS) as Array<keyof typeof EMAIL_QUERY_PARAMS>;

function emailQueryParamsGuardFn(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> {
  const isValidModel = hasNoNullsFromMap<EmailQueryParams>(
    route.queryParamMap,
   EMAIL_QUERY_PARAM_KEYS
  );

  if (isValidModel) {    
    return true;
  }
  const router = inject(Router);
  router.navigateByUrl('/dashboard');
  return false;
}

export const emailQueryParamsGuard: CanActivateFn = emailQueryParamsGuardFn;


