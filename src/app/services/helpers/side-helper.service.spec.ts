import { TestBed, inject } from '@angular/core/testing';

import { SideHelperService } from './side-helper.service';

describe('SideHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideHelperService]
    });
  });

  it('should be created', inject([SideHelperService], (service: SideHelperService) => {
    expect(service).toBeTruthy();
  }));
});
