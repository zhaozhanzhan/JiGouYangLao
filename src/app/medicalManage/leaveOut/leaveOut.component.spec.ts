import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LeaveOutComponent } from "./leaveOut.component";

describe("LeaveOutComponent", () => {
  let component: LeaveOutComponent;
  let fixture: ComponentFixture<LeaveOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveOutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
