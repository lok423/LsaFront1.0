import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMainComponent } from './find-main.component';

describe('FindMainComponent', () => {
  let component: FindMainComponent;
  let fixture: ComponentFixture<FindMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
