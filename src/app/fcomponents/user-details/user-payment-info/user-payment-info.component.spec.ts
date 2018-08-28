import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentInfoComponent } from './user-payment-info.component';

describe('UserPaymentInfoComponent', () => {
  let component: UserPaymentInfoComponent;
  let fixture: ComponentFixture<UserPaymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
