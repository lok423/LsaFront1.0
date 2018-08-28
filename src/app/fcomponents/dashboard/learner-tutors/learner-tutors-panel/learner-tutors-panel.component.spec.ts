import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerTutorsPanelComponent } from './learner-tutors-panel.component';

describe('LearnerTutorsPanelComponent', () => {
  let component: LearnerTutorsPanelComponent;
  let fixture: ComponentFixture<LearnerTutorsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerTutorsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerTutorsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
