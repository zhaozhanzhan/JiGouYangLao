import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HospitalRegistrationCheckAddEditComponent } from "./hospitalRegistration-add-edit.component";

describe("PharmaceuticalAdministrationAddEditComponent", () => {
  let component: HospitalRegistrationCheckAddEditComponent;
  let fixture: ComponentFixture<HospitalRegistrationCheckAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalRegistrationCheckAddEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      HospitalRegistrationCheckAddEditComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
