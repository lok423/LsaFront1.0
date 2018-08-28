import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomePanelComponent } from './dashboard-home-panel.component';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomePanelComponent;
  let fixture: ComponentFixture<DashboardHomePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHomePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHomePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
