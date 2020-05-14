import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BloodPressureRecordComponent } from "./bloodPressureRecord.component";

describe("BloodPressureRecordComponent", () => {
  let component: BloodPressureRecordComponent;
  let fixture: ComponentFixture<BloodPressureRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BloodPressureRecordComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
