import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResourcePanelComponent } from './edit-resource-panel.component';

describe('EditResourcePanelComponent', () => {
  let component: EditResourcePanelComponent;
  let fixture: ComponentFixture<EditResourcePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditResourcePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResourcePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
