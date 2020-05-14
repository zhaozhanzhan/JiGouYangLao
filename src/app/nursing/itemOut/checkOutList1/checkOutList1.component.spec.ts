import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckOutList1Component } from './checkOutList1.component';


describe('OutStorehouseList1Component', () => {
  let component: CheckOutList1Component;
  let fixture: ComponentFixture<CheckOutList1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutList1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
