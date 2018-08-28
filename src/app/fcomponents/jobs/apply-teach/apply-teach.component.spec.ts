import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyTeachComponent } from './apply-teach.component';

describe('ApplyTeachComponent', () => {
  let component: ApplyTeachComponent;
  let fixture: ComponentFixture<ApplyTeachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyTeachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyTeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
