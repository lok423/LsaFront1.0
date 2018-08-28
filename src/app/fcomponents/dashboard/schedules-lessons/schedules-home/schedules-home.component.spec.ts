import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesHomeComponent } from './schedules-home.component';

describe('SchedulesHomeComponent', () => {
  let component: SchedulesHomeComponent;
  let fixture: ComponentFixture<SchedulesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
