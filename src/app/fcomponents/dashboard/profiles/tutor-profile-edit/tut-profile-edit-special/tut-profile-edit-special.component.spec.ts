import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutProfileEditSpecialComponent } from './tut-profile-edit-special.component';

describe('TutProfileEditSpecialComponent', () => {
  let component: TutProfileEditSpecialComponent;
  let fixture: ComponentFixture<TutProfileEditSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutProfileEditSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutProfileEditSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
