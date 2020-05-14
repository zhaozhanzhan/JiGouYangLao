import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MedicalScoreComponent } from "./medicalScore.component";

describe("MedicalScoreComponent", () => {
  let component: MedicalScoreComponent;
  let fixture: ComponentFixture<MedicalScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalScoreComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
