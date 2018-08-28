import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTutorComponent } from './applicant-tutor.component';

describe('ApplicantTutorComponent', () => {
  let component: ApplicantTutorComponent;
  let fixture: ComponentFixture<ApplicantTutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantTutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
