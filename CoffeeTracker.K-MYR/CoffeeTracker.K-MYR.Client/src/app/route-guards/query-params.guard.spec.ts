import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmEmailGuard } from './query-params.guard';

describe('queryParamsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmEmailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
