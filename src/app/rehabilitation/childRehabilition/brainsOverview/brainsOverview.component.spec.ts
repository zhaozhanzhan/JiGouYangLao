import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrainsOverviewComponent } from "./brainsOverview.component";
describe("BrainsOverviewComponent", () => {
  let component: BrainsOverviewComponent;
  let fixture: ComponentFixture<BrainsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrainsOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
