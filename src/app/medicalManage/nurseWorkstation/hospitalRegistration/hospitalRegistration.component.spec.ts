import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HospitalRegistrationComponent } from "./hospitalRegistration.component";

describe("PharmaceuticalAdministrationComponent", () => {
  let component: HospitalRegistrationComponent;
  let fixture: ComponentFixture<HospitalRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalRegistrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
