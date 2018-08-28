import { TestBed, inject } from '@angular/core/testing';

import { FileValidationService } from './file-validation.service';

describe('FileValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileValidationService]
    });
  });

  it('should be created', inject([FileValidationService], (service: FileValidationService) => {
    expect(service).toBeTruthy();
  }));
});
