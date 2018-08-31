import { TestBed, inject } from '@angular/core/testing';

import { MessengerHelperService } from './messenger-helper.service';

describe('MessengerHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessengerHelperService]
    });
  });

  it('should be created', inject([MessengerHelperService], (service: MessengerHelperService) => {
    expect(service).toBeTruthy();
  }));
});
