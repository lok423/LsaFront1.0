import { TestBed, inject } from '@angular/core/testing';

import { GeneralRepositoryService } from './general-repository.service';

describe('GeneralRepositoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralRepositoryService]
    });
  });

  it('should be created', inject([GeneralRepositoryService], (service: GeneralRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
