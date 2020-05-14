import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SeasonalPlanDetailsComponent } from "./seasonalPlanDetails.component";
describe("SeasonalPlanDetailsComponent", () => {
  let component: SeasonalPlanDetailsComponent;
  let fixture: ComponentFixture<SeasonalPlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonalPlanDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonalPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
