import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LimePlanComponent } from "./limePlan.component";
describe("LimePlanComponent", () => {
  let component: LimePlanComponent;
  let fixture: ComponentFixture<LimePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LimePlanComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
