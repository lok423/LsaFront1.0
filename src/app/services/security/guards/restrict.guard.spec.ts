import { TestBed, async, inject } from '@angular/core/testing';

import { RestrictGuard } from './restrict.guard';

describe('RestrictGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestrictGuard]
    });
  });

  it('should ...', inject([RestrictGuard], (guard: RestrictGuard) => {
    expect(guard).toBeTruthy();
  }));
});
