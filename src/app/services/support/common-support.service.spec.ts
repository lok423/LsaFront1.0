import { TestBed, inject } from '@angular/core/testing';

import { CommonSupportService } from './common-support.service';

describe('CommonSupportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonSupportService]
    });
  });

  it('should be created', inject([CommonSupportService], (service: CommonSupportService) => {
    expect(service).toBeTruthy();
  }));
});
