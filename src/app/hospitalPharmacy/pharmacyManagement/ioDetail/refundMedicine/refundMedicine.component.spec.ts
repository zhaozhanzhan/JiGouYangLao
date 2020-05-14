import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RefundMedicineComponent } from './refundMedicine.component';


describe('RefundMedicineComponent', () => {
  let component: RefundMedicineComponent;
  let fixture: ComponentFixture<RefundMedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundMedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
