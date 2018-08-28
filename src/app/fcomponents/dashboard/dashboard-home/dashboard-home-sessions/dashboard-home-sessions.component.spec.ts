import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomeSessionsComponent } from './dashboard-home-sessions.component';

describe('DashboardHomeSessionsComponent', () => {
  let component: DashboardHomeSessionsComponent;
  let fixture: ComponentFixture<DashboardHomeSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHomeSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHomeSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
