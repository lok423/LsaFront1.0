import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTeachersMainComponent } from './help-teachers-main.component';

describe('HelpTeachersMainComponent', () => {
  let component: HelpTeachersMainComponent;
  let fixture: ComponentFixture<HelpTeachersMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpTeachersMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTeachersMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
