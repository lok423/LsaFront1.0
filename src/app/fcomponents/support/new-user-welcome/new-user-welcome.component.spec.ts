import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserWelcomeComponent } from './new-user-welcome.component';

describe('NewUserWelcomeComponent', () => {
  let component: NewUserWelcomeComponent;
  let fixture: ComponentFixture<NewUserWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
