import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorBookingsComponent } from './tutor-bookings.component';

describe('TutorBookingsComponent', () => {
  let component: TutorBookingsComponent;
  let fixture: ComponentFixture<TutorBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
