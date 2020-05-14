import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AttendingPhysicianComponent } from "./attendingPhysician.component";

describe("AttendingPhysicianComponent", () => {
  let component: AttendingPhysicianComponent;
  let fixture: ComponentFixture<AttendingPhysicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttendingPhysicianComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendingPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
