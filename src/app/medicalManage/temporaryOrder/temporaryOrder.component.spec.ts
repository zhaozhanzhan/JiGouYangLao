import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TemporaryOrderComponent } from "./temporaryOrder.component";

describe("TemporaryOrderComponent", () => {
  let component: TemporaryOrderComponent;
  let fixture: ComponentFixture<TemporaryOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemporaryOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
