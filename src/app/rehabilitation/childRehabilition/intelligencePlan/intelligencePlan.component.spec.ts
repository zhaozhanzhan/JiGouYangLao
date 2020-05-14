import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IntelligencePlanComponent } from "./intelligencePlan.component";
describe("IntelligencePlanComponent", () => {
  let component: IntelligencePlanComponent;
  let fixture: ComponentFixture<IntelligencePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntelligencePlanComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligencePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
