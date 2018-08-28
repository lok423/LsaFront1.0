import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorSchedulesEditComponent } from './tutor-schedules-edit.component';

describe('TutorSchedulesEditComponent', () => {
  let component: TutorSchedulesEditComponent;
  let fixture: ComponentFixture<TutorSchedulesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorSchedulesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorSchedulesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
