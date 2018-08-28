import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResourcesBarComponent } from './search-resources-bar.component';

describe('SearchResourcesBarComponent', () => {
  let component: SearchResourcesBarComponent;
  let fixture: ComponentFixture<SearchResourcesBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResourcesBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResourcesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
