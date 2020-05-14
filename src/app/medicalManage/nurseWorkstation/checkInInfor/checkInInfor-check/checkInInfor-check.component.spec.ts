import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckInInforCheckComponent } from "./checkInInfor-check.component";

describe("PharmaceuticalAdministrationCheckComponent", () => {
  let component: CheckInInforCheckComponent;
  let fixture: ComponentFixture<CheckInInforCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckInInforCheckComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInInforCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
