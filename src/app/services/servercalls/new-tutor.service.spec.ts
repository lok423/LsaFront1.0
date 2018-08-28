import { TestBed, inject } from '@angular/core/testing';

import { NewTutorService } from './new-tutor.service';

describe('NewTutorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewTutorService]
    });
  });

  it('should be created', inject([NewTutorService], (service: NewTutorService) => {
    expect(service).toBeTruthy();
  }));
});
