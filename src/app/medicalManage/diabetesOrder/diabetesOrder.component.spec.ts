import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiabetesOrderComponent } from "./diabetesOrder.component";

describe("DiabetesOrderComponent", () => {
  let component: DiabetesOrderComponent;
  let fixture: ComponentFixture<DiabetesOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiabetesOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiabetesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
