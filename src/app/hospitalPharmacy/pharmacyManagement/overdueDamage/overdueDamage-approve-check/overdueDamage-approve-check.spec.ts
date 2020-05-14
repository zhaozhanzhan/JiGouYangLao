import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueDamageApproveCheckComponent } from './overdueDamage-approve-check.component';





describe('OverdueDamageApproveCheckComponent', () => {
  let component: OverdueDamageApproveCheckComponent;
  let fixture: ComponentFixture<OverdueDamageApproveCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueDamageApproveCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueDamageApproveCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
