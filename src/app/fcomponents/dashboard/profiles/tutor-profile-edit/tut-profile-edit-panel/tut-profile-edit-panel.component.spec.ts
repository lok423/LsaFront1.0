import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutProfileEditPanelComponent } from './tut-profile-edit-panel.component';

describe('TutProfileEditPanelComponent', () => {
  let component: TutProfileEditPanelComponent;
  let fixture: ComponentFixture<TutProfileEditPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutProfileEditPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutProfileEditPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
