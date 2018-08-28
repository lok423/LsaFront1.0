import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesControllerComponent } from './resources-controller.component';

describe('ResourcesControllerComponent', () => {
  let component: ResourcesControllerComponent;
  let fixture: ComponentFixture<ResourcesControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
