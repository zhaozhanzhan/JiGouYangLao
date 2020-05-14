import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NursingOrderYGComponent } from "./nursingOrderYG.component";

describe("NursingOrderYGComponent", () => {
  let component: NursingOrderYGComponent;
  let fixture: ComponentFixture<NursingOrderYGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NursingOrderYGComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingOrderYGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
