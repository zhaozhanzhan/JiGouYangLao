import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckInInforComponent } from "./checkInInfor.component";

describe("PharmaceuticalAdministrationComponent", () => {
  let component: CheckInInforComponent;
  let fixture: ComponentFixture<CheckInInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckInInforComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
