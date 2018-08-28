import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRelationsComponent } from './investor-relations.component';

describe('InvestorRelationsComponent', () => {
  let component: InvestorRelationsComponent;
  let fixture: ComponentFixture<InvestorRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
