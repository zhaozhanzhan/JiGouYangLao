import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RegistrationTrainingComponent } from "../registrationTraining/registrationTraining.component";

describe("RegistrationTrainingComponent", () => {
  let component: RegistrationTrainingComponent;
  let fixture: ComponentFixture<RegistrationTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationTrainingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
