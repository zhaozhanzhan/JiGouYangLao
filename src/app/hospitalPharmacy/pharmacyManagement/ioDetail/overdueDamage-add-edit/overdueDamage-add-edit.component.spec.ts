import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OverdueDamageAddComponent } from "./overdueDamage-add-edit.component";

describe("OverdueDamageAddComponent", () => {
  let component: OverdueDamageAddComponent;
  let fixture: ComponentFixture<OverdueDamageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverdueDamageAddComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueDamageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
