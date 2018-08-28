import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResourcesPanelComponent } from './search-resources-panel.component';

describe('SearchResourcesPanelComponent', () => {
  let component: SearchResourcesPanelComponent;
  let fixture: ComponentFixture<SearchResourcesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResourcesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResourcesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
