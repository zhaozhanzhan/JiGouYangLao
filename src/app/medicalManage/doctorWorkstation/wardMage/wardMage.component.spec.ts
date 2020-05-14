import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WardMageComponent } from "./wardMage.component";

describe("WardMageComponent", () => {
  let component: WardMageComponent;
  let fixture: ComponentFixture<WardMageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WardMageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WardMageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
