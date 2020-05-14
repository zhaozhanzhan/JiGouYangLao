import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OnHandOrderComponent } from "./onHandOrder.component";

describe("OnHandOrderComponent", () => {
  let component: OnHandOrderComponent;
  let fixture: ComponentFixture<OnHandOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnHandOrderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnHandOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
