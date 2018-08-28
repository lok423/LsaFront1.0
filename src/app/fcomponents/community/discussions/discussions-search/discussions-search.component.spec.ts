import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionsSearchComponent } from './discussions-search.component';

describe('DiscussionsSearchComponent', () => {
  let component: DiscussionsSearchComponent;
  let fixture: ComponentFixture<DiscussionsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
