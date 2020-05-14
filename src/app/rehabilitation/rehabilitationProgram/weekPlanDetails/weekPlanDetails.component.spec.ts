import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WeekPlanDetailsComponent } from "./weekPlanDetails.component";
describe("WeekPlanDetailsComponent", () => {
  let component: WeekPlanDetailsComponent;
  let fixture: ComponentFixture<WeekPlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeekPlanDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
