import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideHelperComponent } from './side-helper.component';

describe('SideHelperComponent', () => {
  let component: SideHelperComponent;
  let fixture: ComponentFixture<SideHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
