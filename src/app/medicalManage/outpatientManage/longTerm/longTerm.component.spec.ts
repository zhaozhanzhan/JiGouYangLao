import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LongTermComponent } from "./longTerm.component";

describe("LongTermComponent", () => {
  let component: LongTermComponent;
  let fixture: ComponentFixture<LongTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LongTermComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
