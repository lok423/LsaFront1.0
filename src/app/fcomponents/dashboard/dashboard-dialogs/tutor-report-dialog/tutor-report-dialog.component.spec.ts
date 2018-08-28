import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorReportDialogComponent } from './tutor-report-dialog.component';

describe('TutorReportDialogComponent', () => {
  let component: TutorReportDialogComponent;
  let fixture: ComponentFixture<TutorReportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorReportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
