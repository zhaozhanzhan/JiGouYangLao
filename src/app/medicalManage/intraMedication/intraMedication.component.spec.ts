import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { IntraMedicationComponent } from "./intraMedication.component";

describe("IntraMedicationComponent", () => {
  let component: IntraMedicationComponent;
  let fixture: ComponentFixture<IntraMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntraMedicationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntraMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
