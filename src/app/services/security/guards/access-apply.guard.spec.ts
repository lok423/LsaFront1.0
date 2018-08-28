import { TestBed, async, inject } from '@angular/core/testing';

import { AccessApplyGuard } from './access-apply.guard';

describe('AccessApplyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessApplyGuard]
    });
  });

  it('should ...', inject([AccessApplyGuard], (guard: AccessApplyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
