import { TestBed, inject } from '@angular/core/testing';

import { CalendarSupportService } from './calendar-support.service';

describe('CalendarSupportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarSupportService]
    });
  });

  it('should be created', inject([CalendarSupportService], (service: CalendarSupportService) => {
    expect(service).toBeTruthy();
  }));
});
