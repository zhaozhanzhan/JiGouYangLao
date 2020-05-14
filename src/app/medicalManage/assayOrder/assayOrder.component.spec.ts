import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AssayOrderComponent } from "./assayOrder.component";

describe("AssayOrderComponent", () => {
  let component: AssayOrderComponent;
  let fixture: ComponentFixture<AssayOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssayOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
