import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortAnswersParentComponent } from './short-answers-parent.component';

describe('ShortAnswersParentComponent', () => {
  let component: ShortAnswersParentComponent;
  let fixture: ComponentFixture<ShortAnswersParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortAnswersParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortAnswersParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
