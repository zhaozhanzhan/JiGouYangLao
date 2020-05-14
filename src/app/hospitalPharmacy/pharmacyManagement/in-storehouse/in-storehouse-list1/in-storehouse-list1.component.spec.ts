import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InStorehouseList1Component } from './in-storehouse-list1.component';

describe('InStorehouseList1Component', () => {
  let component: InStorehouseList1Component;
  let fixture: ComponentFixture<InStorehouseList1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InStorehouseList1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InStorehouseList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
