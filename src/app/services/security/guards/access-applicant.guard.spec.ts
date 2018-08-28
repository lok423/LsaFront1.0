import { TestBed, async, inject } from '@angular/core/testing';

import { AccessApplicantGuard } from './access-applicant.guard';

describe('AccessApplicantGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessApplicantGuard]
    });
  });

  it('should ...', inject([AccessApplicantGuard], (guard: AccessApplicantGuard) => {
    expect(guard).toBeTruthy();
  }));
});
