import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LimeDetailsComponent } from "./limeDetails.component";
describe("LimeDetailsComponent", () => {
  let component: LimeDetailsComponent;
  let fixture: ComponentFixture<LimeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LimeDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
