import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorHomeworkComponent } from './tutor-homework.component';

describe('TutorHomeworkComponent', () => {
  let component: TutorHomeworkComponent;
  let fixture: ComponentFixture<TutorHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
