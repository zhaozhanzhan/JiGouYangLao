import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueDamageCheckComponent } from './overdueDamage-check.component';




describe('OverdueDamageCheckComponent', () => {
  let component: OverdueDamageCheckComponent;
  let fixture: ComponentFixture<OverdueDamageCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueDamageCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueDamageCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
