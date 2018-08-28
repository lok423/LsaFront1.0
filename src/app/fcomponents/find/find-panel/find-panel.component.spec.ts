import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPanelComponent } from './find-panel.component';

describe('FindPanelComponent', () => {
  let component: FindPanelComponent;
  let fixture: ComponentFixture<FindPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
