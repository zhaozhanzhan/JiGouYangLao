import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueDamageComponent } from './overdueDamage.component';



describe('OverdueDamageComponent', () => {
  let component: OverdueDamageComponent;
  let fixture: ComponentFixture<OverdueDamageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueDamageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
