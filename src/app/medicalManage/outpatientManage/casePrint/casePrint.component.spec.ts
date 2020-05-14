import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CasePrintComponent } from "./casePrint.component";

describe("casePrintComponent", () => {
  let component: CasePrintComponent;
  let fixture: ComponentFixture<CasePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CasePrintComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
