import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditDetailsComponent } from './user-edit-details.component';

describe('UserEditDetailsComponent', () => {
  let component: UserEditDetailsComponent;
  let fixture: ComponentFixture<UserEditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
