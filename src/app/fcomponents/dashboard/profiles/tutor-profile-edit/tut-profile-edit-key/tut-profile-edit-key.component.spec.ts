import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutProfileEditKeyComponent } from './tut-profile-edit-key.component';

describe('TutProfileEditKeyComponent', () => {
  let component: TutProfileEditKeyComponent;
  let fixture: ComponentFixture<TutProfileEditKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutProfileEditKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutProfileEditKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
