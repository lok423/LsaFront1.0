import { TestBed, inject } from '@angular/core/testing';

import { ProfileHelperService } from './profile-helper.service';

describe('RemindersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileHelperService]
    });
  });

  it('should be created', inject([ProfileHelperService], (service: ProfileHelperService) => {
    expect(service).toBeTruthy();
  }));
});
