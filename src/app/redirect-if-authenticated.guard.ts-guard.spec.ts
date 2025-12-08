import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectIfAuthenticatedGuardTsGuard } from './redirect-if-authenticated.guard.ts-guard';

describe('redirectIfAuthenticatedGuardTsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectIfAuthenticatedGuardTsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
