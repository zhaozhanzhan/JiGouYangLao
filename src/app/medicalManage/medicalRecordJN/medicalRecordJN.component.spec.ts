import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MedicalRecordJNComponent } from "./medicalRecordJN.component";

describe("MedicalRecordJNComponent", () => {
  let component: MedicalRecordJNComponent;
  let fixture: ComponentFixture<MedicalRecordJNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordJNComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordJNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
