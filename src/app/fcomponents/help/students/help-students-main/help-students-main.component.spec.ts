import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStudentsMainComponent } from './help-students-main.component';

describe('HelpStudentsMainComponent', () => {
  let component: HelpStudentsMainComponent;
  let fixture: ComponentFixture<HelpStudentsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpStudentsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStudentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
