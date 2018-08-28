import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesCreateDisplayCardComponent } from './resources-create-display-card.component';

describe('ResourcesCreateDisplayCardComponent', () => {
  let component: ResourcesCreateDisplayCardComponent;
  let fixture: ComponentFixture<ResourcesCreateDisplayCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesCreateDisplayCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesCreateDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
