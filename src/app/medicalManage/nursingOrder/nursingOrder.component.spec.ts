import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NursingOrderComponent } from "./nursingOrder.component";

describe("NursingOrderComponent", () => {
  let component: NursingOrderComponent;
  let fixture: ComponentFixture<NursingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NursingOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
