import { TestBed, inject } from '@angular/core/testing';

import { ResourceRepositoryService } from './resource-repository.service';

describe('ResourceRepositoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceRepositoryService]
    });
  });

  it('should be created', inject([ResourceRepositoryService], (service: ResourceRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
