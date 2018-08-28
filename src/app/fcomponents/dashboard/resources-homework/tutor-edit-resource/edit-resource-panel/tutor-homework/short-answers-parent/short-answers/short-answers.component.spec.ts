import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortAnswersComponent } from './short-answers.component';

describe('ShortAnswersComponent', () => {
  let component: ShortAnswersComponent;
  let fixture: ComponentFixture<ShortAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
