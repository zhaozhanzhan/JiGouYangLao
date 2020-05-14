import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckInInforAddEditComponent } from "./checkInInfor-add-edit.component";

describe("PharmaceuticalAdministrationAddEditComponent", () => {
  let component: CheckInInforAddEditComponent;
  let fixture: ComponentFixture<CheckInInforAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckInInforAddEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInInforAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
