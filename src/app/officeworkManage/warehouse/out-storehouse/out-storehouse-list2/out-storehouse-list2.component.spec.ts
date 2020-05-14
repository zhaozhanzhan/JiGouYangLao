import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorehouseList2Component } from './out-storehouse-list2.component';

describe('OutStorehouseList2Component', () => {
  let component: OutStorehouseList2Component;
  let fixture: ComponentFixture<OutStorehouseList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorehouseList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorehouseList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
