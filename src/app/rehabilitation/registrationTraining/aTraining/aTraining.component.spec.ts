import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ATrainingComponent } from "./aTraining.component";

describe("ATrainingComponent", () => {
  let component: ATrainingComponent;
  let fixture: ComponentFixture<ATrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ATrainingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
