import { TestBed, async, inject } from '@angular/core/testing';

import { AccessTutorGuard } from './access-tutor.guard';

describe('AccessTutorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessTutorGuard]
    });
  });

  it('should ...', inject([AccessTutorGuard], (guard: AccessTutorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
