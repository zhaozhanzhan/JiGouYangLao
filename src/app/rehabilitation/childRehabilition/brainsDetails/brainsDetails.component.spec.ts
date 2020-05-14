import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrainsDetailsComponent } from "./brainsDetails.component";
describe("BrainsDetailsComponent", () => {
  let component: BrainsDetailsComponent;
  let fixture: ComponentFixture<BrainsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrainsDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
