import { TestBed } from '@angular/core/testing';

import { KeepLoggedInGuard } from './keep-logged-in.guard';

describe('KeepLoggedInGuard', () => {
  let guard: KeepLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KeepLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
