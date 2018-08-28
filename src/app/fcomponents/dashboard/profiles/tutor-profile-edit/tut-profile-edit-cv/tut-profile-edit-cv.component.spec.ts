import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutProfileEditCvComponent } from './tut-profile-edit-cv.component';

describe('TutProfileEditCvComponent', () => {
  let component: TutProfileEditCvComponent;
  let fixture: ComponentFixture<TutProfileEditCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutProfileEditCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutProfileEditCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
