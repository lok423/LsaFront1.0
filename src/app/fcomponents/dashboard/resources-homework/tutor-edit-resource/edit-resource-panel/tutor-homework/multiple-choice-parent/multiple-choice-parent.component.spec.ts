import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceParentComponent } from './multiple-choice-parent.component';

describe('MultipleChoiceParentComponent', () => {
  let component: MultipleChoiceParentComponent;
  let fixture: ComponentFixture<MultipleChoiceParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
