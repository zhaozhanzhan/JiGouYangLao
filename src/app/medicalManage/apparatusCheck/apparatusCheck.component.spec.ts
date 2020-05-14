import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ApparatusCheckComponent } from "./apparatusCheck.component";

describe("ApparatusCheckComponent", () => {
  let component: ApparatusCheckComponent;
  let fixture: ComponentFixture<ApparatusCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApparatusCheckComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparatusCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
