import { TestBed, inject } from '@angular/core/testing';

import { ResourceSupportService } from './resource-support.service';

describe('ResourceSupportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceSupportService]
    });
  });

  it('should be created', inject([ResourceSupportService], (service: ResourceSupportService) => {
    expect(service).toBeTruthy();
  }));
});
