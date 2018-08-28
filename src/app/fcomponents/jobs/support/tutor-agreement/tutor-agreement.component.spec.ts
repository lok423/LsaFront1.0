import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorAgreementComponent } from './tutor-agreement.component';

describe('TutorAgreementComponent', () => {
  let component: TutorAgreementComponent;
  let fixture: ComponentFixture<TutorAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
