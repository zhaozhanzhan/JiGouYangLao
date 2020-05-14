import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InStorehouseList2Component } from './in-storehouse-list2.component';

describe('InStorehouseList2Component', () => {
  let component: InStorehouseList2Component;
  let fixture: ComponentFixture<InStorehouseList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InStorehouseList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InStorehouseList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
