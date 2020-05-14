import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HospitalRegistrationCheckComponent } from "./hospitalRegistration-check.component";

describe("PharmaceuticalAdministrationCheckComponent", () => {
  let component: HospitalRegistrationCheckComponent;
  let fixture: ComponentFixture<HospitalRegistrationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalRegistrationCheckComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRegistrationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
