import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueDamageApproveComponent } from './overdueDamage-approve.component';





describe('OverdueDamageApproveComponent', () => {
  let component: OverdueDamageApproveComponent;
  let fixture: ComponentFixture<OverdueDamageApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueDamageApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueDamageApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
