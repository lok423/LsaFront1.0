import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorScheduleShowComponent } from './tutor-schedules-show.component';

describe('TutorScheduleShowComponent', () => {
  let component: TutorScheduleShowComponent;
  let fixture: ComponentFixture<TutorScheduleShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorScheduleShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorScheduleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
