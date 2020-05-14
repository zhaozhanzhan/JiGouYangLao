import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckOutList2Component } from './checkOutList2.component';


describe('OutStorehouseList2Component', () => {
  let component: CheckOutList2Component;
  let fixture: ComponentFixture<CheckOutList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
