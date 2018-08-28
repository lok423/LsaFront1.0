import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSessionIssueDialogComponent } from './report-session-issue-dialog.component';

describe('ReportSessionIssueDialogComponent', () => {
  let component: ReportSessionIssueDialogComponent;
  let fixture: ComponentFixture<ReportSessionIssueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSessionIssueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSessionIssueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
