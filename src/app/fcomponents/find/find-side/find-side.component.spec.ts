import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSideComponent } from './find-side.component';

describe('FindSideComponent', () => {
  let component: FindSideComponent;
  let fixture: ComponentFixture<FindSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
