import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEditDialogComponent } from './session-edit-dialog.component';

describe('SessionEditDialogComponent', () => {
  let component: SessionEditDialogComponent;
  let fixture: ComponentFixture<SessionEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
