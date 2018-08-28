import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoadComponent } from './external-load.component';

describe('ExternalLoadComponent', () => {
  let component: ExternalLoadComponent;
  let fixture: ComponentFixture<ExternalLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
