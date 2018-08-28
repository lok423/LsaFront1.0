import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpApplicantsMainComponent } from './help-applicants-main.component';

describe('HelpApplicantsMainComponent', () => {
  let component: HelpApplicantsMainComponent;
  let fixture: ComponentFixture<HelpApplicantsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpApplicantsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpApplicantsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
