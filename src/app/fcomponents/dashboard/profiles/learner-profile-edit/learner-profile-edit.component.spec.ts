import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerProfileEditComponent } from './learner-profile-edit.component';

describe('LearnerProfileEditComponent', () => {
  let component: LearnerProfileEditComponent;
  let fixture: ComponentFixture<LearnerProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
