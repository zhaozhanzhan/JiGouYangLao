import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorehouseList1Component } from './out-storehouse-list1.component';

describe('OutStorehouseList1Component', () => {
  let component: OutStorehouseList1Component;
  let fixture: ComponentFixture<OutStorehouseList1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorehouseList1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorehouseList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
