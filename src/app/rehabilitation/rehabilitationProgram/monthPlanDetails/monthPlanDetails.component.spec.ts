import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MonthPlanDetailsComponent } from "./monthPlanDetails.component";
describe("MonthPlanDetailsComponent", () => {
  let component: MonthPlanDetailsComponent;
  let fixture: ComponentFixture<MonthPlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthPlanDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
