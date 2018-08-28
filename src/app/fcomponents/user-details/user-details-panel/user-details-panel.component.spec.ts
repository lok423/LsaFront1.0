import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsPanelComponent } from './user-details-panel.component';

describe('UserDetailsPanelComponent', () => {
  let component: UserDetailsPanelComponent;
  let fixture: ComponentFixture<UserDetailsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
